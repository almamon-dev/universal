<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\AuditField;
use App\Models\Chatter;
use App\Models\Creator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AgencyController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Agencies/Index', [
            'agencies' => Agency::withCount('qcs')->latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Agencies/Edit', [
            'agency' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
            'first_paywall_sexting' => 'nullable|numeric|min:0',
            'avg_completed_sexting_sequence' => 'nullable|numeric|min:0',
            'avg_recorded_ppv' => 'nullable|numeric|min:0',
            'qcs' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $agency = Agency::create(Arr::except($validated, ['qcs']));

            // Professional: Link default master audit fields on creation
            $masterFields = AuditField::all();
            $agency->auditFields()->sync($masterFields->pluck('id'));

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Agency created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function edit(Agency $agency)
    {
        $dateFrom = request('date_from');
        $dateTo = request('date_to');

        $auditsQuery = $agency->audits()->with(['user', 'chatter', 'creator'])->latest();

        if ($dateFrom && $dateTo) {
            $from = \Carbon\Carbon::parse($dateFrom)->startOfDay();
            $to = \Carbon\Carbon::parse($dateTo)->endOfDay();
            $auditsQuery->whereBetween('created_at', [$from, $to]);
        }

        $audits = $auditsQuery->get();

        // Calculate Stats
        $sellableCount = 0;
        $nonSellableCount = 0;
        
        foreach ($audits as $audit) {
            $isSellable = false;
            foreach ($audit->responses as $response) {
                if ($response->field_key === 'template-is-this-sellable' && $response->value === 'YES') {
                    $isSellable = true;
                    break;
                }
            }
            if ($isSellable) {
                $sellableCount++;
            } else {
                $nonSellableCount++;
            }
        }

        return Inertia::render('Admin/Agencies/Edit', [
            'agency' => $agency->load(['qcs', 'auditFields']),
            'stats' => [
                'total_audits' => $audits->count(),
                'sellable' => $sellableCount,
                'non_sellable' => $nonSellableCount,
            ],
            'audits' => $audits,
            'chatters' => $agency->chatters()->orderBy('name')->get(),
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function update(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
            'first_paywall_sexting' => 'nullable|numeric|min:0',
            'avg_completed_sexting_sequence' => 'nullable|numeric|min:0',
            'avg_recorded_ppv' => 'nullable|numeric|min:0',
        ]);

        $agency->update($validated);

        return back()->with('success', 'Agency updated successfully.');
    }

    public function updateMetrics(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'first_paywall_sexting' => 'nullable|numeric|min:0',
            'avg_completed_sexting_sequence' => 'nullable|numeric|min:0',
            'avg_recorded_ppv' => 'nullable|numeric|min:0',
        ]);

        $agency->update($validated);

        return back()->with('success', 'Metrics updated successfully.');
    }

    public function audits(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/Audits', [
            'agency' => $agency,
            'audits' => $agency->audits()->latest()->get(),
            'audit_fields' => $agency->auditFields, // Now loads from Pivot Table
        ]);
    }

    public function updateAuditFields(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'fields' => 'present|array',
        ]);

        $syncData = [];
        foreach ($validated['fields'] as $index => $fieldData) {
            $dbId = (isset($fieldData['id']) && is_numeric($fieldData['id'])) ? $fieldData['id'] : null;
            $fieldKey = $fieldData['field_key'] ?? (is_string($fieldData['id'] ?? null) ? $fieldData['id'] : \Illuminate\Support\Str::slug($fieldData['name']));

            $field = null;
            if ($dbId) {
                $field = AuditField::find($dbId);
            }

            if (! $field) {
                $field = AuditField::where('field_key', $fieldKey)->first();
            }

            $data = [
                'name' => $fieldData['name'],
                'field_label' => $fieldData['field_label'] ?? $fieldData['name'],
                'type' => $fieldData['type'] ?? 'select',
                'options' => $fieldData['options'] ?? null,
                'is_required' => (bool) ($fieldData['required'] ?? $fieldData['is_required'] ?? false),
                'is_locked' => (bool) ($fieldData['is_locked'] ?? false),
                'is_conditional' => (bool) ($fieldData['is_conditional'] ?? false),
                'required_if' => $fieldData['required_if'] ?? null,
                'help_text' => $fieldData['help_text'] ?? null,
            ];

            if ($field) {
                $field->update($data);
            } else {
                $data['field_key'] = $fieldKey;
                $field = AuditField::create($data);
            }

            $syncData[$field->id] = ['sort_order' => $index];
        }

        $agency->auditFields()->sync($syncData);

        return back()->with('success', 'Audit fields updated successfully.');
    }

    public function getAuditFields(Agency $agency)
    {
        return response()->json([
            'fields' => $agency->auditFields,
        ]);
    }

    public function protocols(Agency $agency)
    {
        $user = Auth::user();
        $view = $user->role === 'admin' ? 'Admin/Agencies/Protocols' : 'QC/Agencies/Protocols';

        return Inertia::render($view, [
            'agency' => $agency,
            'protocols' => $agency->protocols()->where('type', 'general')->first()?->content ?? '',
        ]);
    }

    public function updateProtocols(Request $request, Agency $agency)
    {
        $validated = $request->validate(['protocols' => 'required|string']);

        $agency->protocols()->updateOrCreate(
            ['type' => 'general'],
            ['content' => $validated['protocols']]
        );

        return back()->with('success', 'Protocols updated successfully.');
    }

    public function discovery(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/Discovery', [
            'agency' => $agency,
            'progress' => $agency->discoveryProgress()->get(),
        ]);
    }

    public function chatterDiscovery(Agency $agency)
    {
        $discovery = $agency->discoveryProgress()
            ->where('type', 'chatter')
            ->get()
            ->mapWithKeys(function ($item) {
                // Try to decode if it's a JSON array/object
                $value = $item->field_value;
                $decoded = json_decode($value, true);

                return [$item->field_key => (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : $value];
            });

        return Inertia::render('Admin/Agencies/ChatterDiscovery', [
            'agency' => $agency,
            'discovery' => (object) $discovery->toArray(),
        ]);
    }

    public function qcDiscovery(Agency $agency)
    {
        $discovery = $agency->discoveryProgress()
            ->where('type', 'qc')
            ->get()
            ->mapWithKeys(function ($item) {
                $value = $item->field_value;
                $decoded = json_decode($value, true);

                return [$item->field_key => (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : $value];
            });

        return Inertia::render('Admin/Agencies/QCDiscovery', [
            'agency' => $agency,
            'discovery' => (object) $discovery->toArray(),
        ]);
    }

    public function ownerDiscovery(Agency $agency)
    {
        $discovery = $agency->discoveryProgress()
            ->where('type', 'owner')
            ->get()
            ->mapWithKeys(function ($item) {
                $value = $item->field_value;
                $decoded = json_decode($value, true);

                return [$item->field_key => (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : $value];
            });

        return Inertia::render('Admin/Agencies/OwnerDiscovery', [
            'agency' => $agency,
            'discovery' => (object) $discovery->toArray(),
        ]);
    }

    public function viewSystemDiscovery(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/ViewSystemDiscovery', [
            'agency' => $agency,
        ]);
    }

    public function updateDiscovery(Request $request, Agency $agency, $type)
    {
        $data = $request->input('data', []);
        foreach ($data as $key => $value) {
            // Fix Array to string conversion error
            $dbValue = is_array($value) ? json_encode($value) : $value;

            $agency->discoveryProgress()->updateOrCreate(
                ['type' => $type, 'field_key' => $key],
                ['field_value' => $dbValue, 'is_completed' => ($value === true || $value === '1' || ! empty($value))]
            );
        }

        return back()->with('success', 'Discovery progress saved successfully.');
    }

    public function createAudit(Agency $agency)
    {
        return Inertia::render('QC/CreateAudit', [
            'agency' => $agency,
            'chatters' => $agency->chatters()->orderBy('name')->get(),
            'creators' => $agency->creators()->orderBy('name')->get(),
            'audit_templates' => $agency->auditFields, // Critical: Fetching from DB
        ]);
    }

    public function storeAudit(Request $request, Agency $agency)
    {
        $user = Auth::user();
        $validated = $request->validate([
            'audits' => 'required|array|min:1',
            'audits.*.chatter_id' => 'required|exists:chatters,id',
            'audits.*.creator_id' => 'required|exists:creators,id',
            'audits.*.subscriber_uid' => 'required|string',
            'audits.*.responses' => 'required|array',
        ]);

        // Strict Validation: Ensure all required fields from the agency's audit template are filled
        $allFields = $agency->auditFields()->orderBy('sort_order')->get();
        $requiredFields = $allFields->where('is_required', true);

        foreach ($validated['audits'] as $index => $auditData) {
            $responses = $auditData['responses'] ?? [];
            
            foreach ($requiredFields as $field) {
                // Check if the field should be visible/required based on conditions
                if (!$this->isFieldVisible($field, $responses, $allFields)) {
                    continue;
                }

                $value = $responses[$field->field_key] ?? null;
                if (is_null($value) || (is_string($value) && trim($value) === '')) {
                    $chatter = Chatter::find($auditData['chatter_id']);
                    $chatterName = $chatter ? $chatter->name : "Audit ".($index + 1);

                    return back()->withErrors([
                        "audits.$index.responses.{$field->field_key}" => "The '{$field->name}' field is required for {$chatterName}.",
                    ])->withInput();
                }
            }
        }

        foreach ($validated['audits'] as $auditData) {
            $audit = \App\Models\SeoAudit::create([
                'user_id' => $user->id,
                'agency_id' => $agency->id,
                'chatter_id' => $auditData['chatter_id'],
                'creator_id' => $auditData['creator_id'],
                'subscriber_uid' => $auditData['subscriber_uid'],
                'status' => 'completed',
            ]);

            foreach ($auditData['responses'] as $key => $value) {
                $audit->responses()->create([
                    'agency_id' => $agency->id,
                    'field_key' => $key,
                    'value' => (string) ($value ?? ''),
                ]);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Audits submitted successfully.');
    }

    public function storeQC(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['username'].'@qc.system', // Fallback for email field
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'agency_id' => $agency->id,
            'role' => 'qc',
        ]);

        return back()->with('success', 'QC member added successfully.');
    }

    public function updateQC(Request $request, User $user)
    {
        return back();
    }

    public function destroyQC(User $user)
    {
        $user->update(['agency_id' => null]);

        return back()->with('success', 'QC member removed successfully.');
    }

    // Standard CRUD methods like registry, storeChatter etc follow same pattern...
    public function registry(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/Registry', [
            'agency' => $agency,
            'chatters' => $agency->chatters()->latest()->get(),
            'creators' => $agency->creators()->latest()->get(),
        ]);
    }

    public function storeChatter(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $agency->chatters()->create($validated);

        return back()->with('success', 'Chatter added successfully.');
    }

    public function destroyChatter(Chatter $chatter)
    {
        $chatter->delete();

        return back()->with('success', 'Chatter removed successfully.');
    }

    public function storeCreator(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $agency->creators()->create($validated);

        return back()->with('success', 'Creator added successfully.');
    }

    public function destroyCreator(Creator $creator)
    {
        $creator->delete();

        return back()->with('success', 'Creator removed successfully.');
    }

    public function updateStatus(Request $request, Agency $agency)
    {

        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);

        $agency->update($validated);

        return back()->with('success', 'Agency status updated successfully.');
    }

    private function isFieldVisible($field, $responses, $allFields)
    {
        return $this->evaluateCondition($field->required_if, $responses, $allFields);
    }

    private function evaluateCondition($condition, $responses, $allFields)
    {
        if (!$condition || !is_string($condition) || empty(trim($condition)) || $condition === 'null') {
            return true;
        }

        $parts = preg_split('/\s+(?:AND|and)\s+/', $condition);
        foreach ($parts as $part) {
            if (preg_match('/(.+?)\s*(!=|==|=)\s*(.+)/', $part, $match)) {
                $label = trim($match[1]);
                $operator = trim($match[2]);
                $expectedValue = trim($match[3]);

                $targetField = $this->findTargetField($label, $allFields);
                
                $potentialKeys = array_filter([
                    $targetField ? ($targetField->field_key ?? $targetField->id) : null,
                    $targetField ? $targetField->id : null,
                    $this->slugify($label),
                    $label
                ]);

                $actualValue = null;
                foreach ($potentialKeys as $key) {
                    if (isset($responses[$key]) && $responses[$key] !== null) {
                        $actualValue = $responses[$key];
                        break;
                    }
                }

                if ($actualValue === null) {
                    return false;
                }

                $sActual = $this->slugify((string)$actualValue);
                $sExpected = $this->slugify((string)$expectedValue);

                $isMatch = ($sActual === $sExpected);
                $conditionMet = ($operator === '!=' ? !$isMatch : $isMatch);

                if (!$conditionMet) {
                    return false;
                }
            }
        }

        return true;
    }

    private function findTargetField($label, $allFields)
    {
        $sLabel = $this->slugify($label);
        if (!$sLabel) return null;

        // 1. Exact match on field_key, id, or slugified name/label
        foreach ($allFields as $f) {
            if ($this->slugify($f->field_key ?? '') === $sLabel || 
                $this->slugify($f->name ?? '') === $sLabel || 
                $this->slugify($f->field_label ?? '') === $sLabel || 
                (string)$f->id === (string)$label) {
                return $f;
            }
        }

        // 2. Partial match
        foreach ($allFields as $f) {
            if (str_contains($this->slugify($f->name ?? ''), $sLabel) || 
                str_contains($this->slugify($f->field_label ?? ''), $sLabel)) {
                return $f;
            }
        }

        return null;
    }

    private function slugify($str)
    {
        return strtolower(preg_replace('/[^a-z0-9]+/i', '', $str));
    }
}
