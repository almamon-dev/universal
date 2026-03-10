<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Chatter;
use App\Models\Creator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AgencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Agencies/Index', [
            'agencies' => Agency::withCount('qcs')->latest()->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Agencies/Edit', [
            'agency' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'first_paywall_sexting' => 'nullable|numeric',
            'avg_completed_sexting_sequence' => 'nullable|numeric',
            'avg_recorded_ppn' => 'nullable|numeric',
            'status' => 'required|string|in:active,inactive',
            'qcs' => 'nullable|array',
            'qcs.*.name' => 'required|string|max:255',
            'qcs.*.username' => 'required|string|max:255|unique:users,username',
            'qcs.*.password' => 'required|string|min:8',
        ]);

        DB::beginTransaction();
        try {
            $agency = Agency::create(Arr::except($validated, ['qcs']));

            if (! empty($validated['qcs'])) {
                foreach ($validated['qcs'] as $qcData) {
                    User::create([
                        'name' => $qcData['name'],
                        'username' => $qcData['username'],
                        'password' => $qcData['password'],
                        'email' => $qcData['username'].'_at'.$agency->id.'@qc.com',
                        'role' => 'qc',
                        'agency_id' => $agency->id,
                    ]);
                }
            }
            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Agency created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Agency Store Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Failed to create agency: '.$e->getMessage()])->withInput();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/Edit', [
            'agency' => $agency->load('qcs'),
            'stats' => [
                'total_audits' => $agency->audits()->count(),
                'sellable' => $agency->audits()->where('response_data->conv_classification', 'SELLABLE')->count(),
                'non_sellable' => $agency->audits()->where('response_data->conv_classification', '!=', 'SELLABLE')->count(),
            ],
            'audits' => $agency->audits()
                ->with(['user', 'chatter', 'creator'])
                ->latest()
                ->get(),
            'chatters' => $agency->chatters()->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'first_paywall_sexting' => 'nullable|numeric',
            'avg_completed_sexting_sequence' => 'nullable|numeric',
            'avg_recorded_ppn' => 'nullable|numeric',
            'status' => 'required|string|in:active,inactive',
            'qcs' => 'nullable|array',
            'qcs.*.id' => 'sometimes|nullable',
            'qcs.*.name' => 'required|string|max:255',
            'qcs.*.username' => 'required|string|max:255',
            'qcs.*.password' => 'nullable|string|min:8',
        ]);

        DB::beginTransaction();
        try {
            Log::info('AGENCY UPDATE START: '.$agency->id);
            $agency->update(Arr::except($validated, ['qcs']));

            if (! empty($validated['qcs'])) {
                Log::info('PROCESSING QCS: '.count($validated['qcs']));
                foreach ($validated['qcs'] as $qcData) {
                    $qcId = isset($qcData['id']) ? (string) $qcData['id'] : null;

                    if ($qcId && str_starts_with($qcId, 'new-')) {
                        Log::info('Creating new QC: '.$qcData['username']);

                        if (User::where('username', $qcData['username'])->exists()) {
                            throw new \Exception("Username '{$qcData['username']}' is already used. Please choose another.");
                        }

                        User::create([
                            'name' => $qcData['name'],
                            'username' => $qcData['username'],
                            'password' => $qcData['password'],
                            'email' => $qcData['username'].'_at'.$agency->id.'@qc.com',
                            'role' => 'qc',
                            'agency_id' => $agency->id,
                        ]);
                        Log::info('New QC created successfully');
                    } elseif ($qcId) {
                        Log::info('Updating existing QC ID: '.$qcId);
                        $user = User::where('id', $qcId)->first();
                        if ($user) {
                            if (User::where('username', $qcData['username'])->where('id', '!=', $user->id)->exists()) {
                                throw new \Exception("Username '{$qcData['username']}' is already used by someone else.");
                            }

                            $updateData = [
                                'name' => $qcData['name'],
                                'username' => $qcData['username'],
                                'email' => $qcData['username'].'_at'.$agency->id.'@qc.com',
                            ];

                            if (! empty($qcData['password'])) {
                                $updateData['password'] = $qcData['password'];
                            }

                            $user->update($updateData);
                            Log::info('QC ID '.$qcId.' updated successfully');
                        }
                    }
                }
            }
            DB::commit();
            Log::info('AGENCY UPDATE COMPLETED');

            return redirect()->route('dashboard')->with('success', 'Agency updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Agency Update Error: '.$e->getMessage());

            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified agency's audits.
     */
    public function audits(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/Audits', [
            'agency' => $agency,
            'audits' => $agency->audits()->latest()->get(),
            'audit_fields' => $agency->audit_fields ?? [],
        ]);
    }

    /**
     * Update the agency's dynamic audit fields.
     */
    public function updateAuditFields(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'fields' => 'required|array',
            'fields.*.id' => 'nullable|string|max:255',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.field_label' => 'nullable|string|max:255',
            'fields.*.type' => 'required|string|in:text,textarea,number,select,checkbox',
            'fields.*.options' => 'nullable|string',
            'fields.*.required' => 'nullable|boolean',
            'fields.*.help_text' => 'nullable|string',
            'fields.*.is_locked' => 'nullable|boolean',
            'fields.*.is_conditional' => 'nullable|boolean',
        ]);

        $agency->update([
            'audit_fields' => array_values($validated['fields']),
        ]);

        return back()->with('success', 'Audit fields updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agency $agency)
    {
        $agency->delete();

        return redirect()->route('dashboard')->with('success', 'Agency deleted successfully.');
    }

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

    public function discovery(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/Discovery', [
            'agency' => $agency,
        ]);
    }

    public function chatterDiscovery(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/ChatterDiscovery', [
            'agency' => $agency,
            'discovery' => (object) ($agency->discovery_data['chatter'] ?? []),
        ]);
    }

    public function qcDiscovery(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/QCDiscovery', [
            'agency' => $agency,
            'discovery' => (object) ($agency->discovery_data['qc'] ?? []),
        ]);
    }

    public function ownerDiscovery(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/OwnerDiscovery', [
            'agency' => $agency,
            'discovery' => (object) ($agency->discovery_data['owner'] ?? []),
        ]);
    }

    public function updateDiscovery(Request $request, Agency $agency, $type)
    {
        $discoveryData = $agency->discovery_data;
        if (! is_array($discoveryData)) {
            $discoveryData = [];
        }

        $discoveryData[$type] = $request->input('data', []);

        $agency->discovery_data = $discoveryData;
        $agency->save();

        return back()->with('success', 'Discovery progress saved successfully.');
    }

    public function viewSystemDiscovery(Agency $agency)
    {
        return Inertia::render('Admin/Agencies/ViewSystemDiscovery', [
            'agency' => $agency,
        ]);
    }

    public function protocols(Agency $agency)
    {
        $user = Auth::user();

        if ($user->role === 'qc' && $user->agency_id !== $agency->id) {
            abort(403, 'Unauthorized action.');
        }

        $view = $user->role === 'admin' ? 'Admin/Agencies/Protocols' : 'QC/Agencies/Protocols';

        return Inertia::render($view, [
            'agency' => $agency,
        ]);
    }

    public function updateProtocols(Request $request, Agency $agency)
    {
        if (! Auth::user()->is_admin) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'protocols' => 'required|string',
        ]);

        $agency->update([
            'protocols' => $validated['protocols'],
        ]);

        return back()->with('success', 'Protocols updated successfully.');
    }

    public function createAudit(Agency $agency)
    {
        $user = Auth::user();

        if ($user->role === 'qc' && $user->agency_id !== $agency->id) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('QC/CreateAudit', [
            'agency' => $agency,
            'chatters' => $agency->chatters()->orderBy('name')->get(),
            'creators' => $agency->creators()->orderBy('name')->get(),
        ]);
    }

    public function storeAudit(Request $request, Agency $agency)
    {
        $user = Auth::user();

        if ($user->role === 'qc' && $user->agency_id !== $agency->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'audits' => 'required|array|min:1',
            'audits.*.chatter_id' => 'required|exists:chatters,id',
            'audits.*.creator_id' => 'required|exists:creators,id',
            'audits.*.subscriber_uid' => 'required|string',
            'audits.*.responses' => 'required|array',
            'audits.*.status' => 'nullable|string',
        ]);

        foreach ($validated['audits'] as $auditData) {
            \App\Models\SeoAudit::create([
                'user_id' => $user->id,
                'chatter_id' => $auditData['chatter_id'],
                'creator_id' => $auditData['creator_id'],
                'subscriber_uid' => $auditData['subscriber_uid'],
                'status' => $auditData['status'] ?? 'completed',
                'response_data' => $auditData['responses'],
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Audits submitted successfully.');
    }

    public function storeQC(Request $request, Agency $agency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => $validated['password'],
            'email' => $validated['username'].'_at'.$agency->id.'@qc.com',
            'role' => 'qc',
            'agency_id' => $agency->id,
        ]);

        return back()->with('success', 'QC Member added successfully.');
    }

    public function destroyQC(User $user)
    {
        if ($user->role !== 'qc') {
            abort(403, 'Only QC members can be removed here.');
        }
        $user->delete();

        return back()->with('success', 'QC Member removed successfully.');
    }

    public function updateQC(Request $request, User $user)
    {
        if ($user->role !== 'qc') {
            abort(403, 'Only QC members can be updated here.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,'.$user->id,
            'password' => 'nullable|string|min:8',
        ]);

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
        ];

        if ($validated['password']) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        return back()->with('success', 'QC Member updated successfully.');
    }
}
