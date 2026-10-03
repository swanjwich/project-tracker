<?php

namespace App\Http\Controllers;

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search'   => ['nullable', 'string', 'max:100'],
            'status'   => ['nullable', Rule::enum(ProjectStatus::class)],
            'priority' => ['nullable', Rule::enum(ProjectPriority::class)],
            'overdue'  => ['nullable', 'boolean'],
            'sort'     => ['nullable', Rule::in([
                'due_date',
                '-due_date',
                'start_date',
                '-start_date',
                'priority',
                '-priority',
                'created_at',
                '-created_at',
            ])],
        ]);

        $projects = Project::query()
            ->search($filters['search'] ?? null)
            ->when($filters['status'] ?? null, fn($q, $s) => $q->where('status', $s))
            ->when($filters['priority'] ?? null, fn($q, $p) => $q->where('priority', $p))
            ->when($request->boolean('overdue'), fn($q) => $q->overdue())
            ->sortBy($filters['sort'] ?? null)
            ->get();

        return ProjectResource::collection($projects)->additional([
            'meta' => ['counts' => $this->counts()],
        ]);
    }

    // Counts for the summary cards, always across ALL projects (not the filtered list)
    private function counts(): array
    {
        $byStatus = Project::selectRaw('status, count(*) as total')
            ->groupBy('status')->pluck('total', 'status');

        return [
            'in_progress' => $byStatus['In Progress'] ?? 0,
            'on_hold'     => $byStatus['On Hold'] ?? 0,
            'completed'   => $byStatus['Completed'] ?? 0,
            'overdue'     => Project::overdue()->count(),
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $project = Project::create($request->validated());

        return (new ProjectResource($project))->response()->setStatusCode(201);
    }
    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return new ProjectResource($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return new ProjectResource($project);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->noContent();
    }
}
