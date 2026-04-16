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
        return Inertia::render('Admin/Agencies/Edit', [
            'agency' => $agency->load('qcs'),
            'stats' => [
                'total_audits' => $agency->audits()->count(),
            ],
            'audits' => $agency->audits()->with(['user', 'chatter', 'creator'])->latest()->get(),
            'chatters' => $agency->chatters()->orderBy('name')->get(),
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

        $fieldIds = [];
        foreach ($validated['fields'] as $fieldData) {
            // Find or Create the master field definition
            $field = AuditField::updateOrCreate(
                ['field_key' => $fieldData['id'] ?? (string) \Illuminate\Support\Str::slug($fieldData['name'])],
                [
                    'name' => $fieldData['name'],
                    'field_label' => $fieldData['field_label'] ?? $fieldData['name'],
                    'type' => $fieldData['type'] ?? 'select',
                    'options' => $fieldData['options'] ?? null,
                    'is_required' => (bool) ($fieldData['required'] ?? false),
                    'is_locked' => (bool) ($fieldData['is_locked'] ?? false),
                    'is_conditional' => (bool) ($fieldData['is_conditional'] ?? false),
                    'required_if' => $fieldData['required_if'] ?? null,
                    'help_text' => $fieldData['help_text'] ?? null,
                ]
            );

            $fieldIds[] = $field->id;
        }

        // Sync pivot table professionally
        $agency->auditFields()->sync($fieldIds);

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
}
