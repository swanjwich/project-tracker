import PrimaryButton from '@/Components/PrimaryButton';
import DeleteProjectModal from '@/Components/Projects/DeleteProjectModal';
import ProjectCards from '@/Components/Projects/ProjectCards';
import ProjectFormModal from '@/Components/Projects/ProjectFormModal';
import ProjectTable from '@/Components/Projects/ProjectTable';
import ProjectToolbar, { defaultFilters, hasActiveFilters } from '@/Components/Projects/ProjectToolbar';
import SummaryCards from '@/Components/Projects/SummaryCards';
import { getProjects } from '@/api/projects';
import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Only send filters that are set, e.g. { status: 'On Hold', sort: 'due_date' }.
function toParams(filters, search) {
    return Object.fromEntries(
        Object.entries({ ...filters, search, overdue: filters.overdue ? 1 : '' })
            .filter(([, value]) => value !== ''),
    );
}

export default function Index({ statuses, priorities }) {
    const [projects, setProjects] = useState([]);
    const [counts, setCounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [notice, setNotice] = useState(null);

    const [filters, setFilters] = useState(defaultFilters);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const latestRequest = useRef(0);

    // Selected project stays set while a modal closes, so its content doesn't flicker.
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(null);

    // Wait until typing pauses before searching.
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const { status, priority, overdue, sort } = filters;

    const loadProjects = useCallback(async () => {
        const requestId = ++latestRequest.current;
        setLoading(true);
        setLoadError(null);

        try {
            const { data, meta } = await getProjects(
                toParams({ status, priority, overdue, sort }, debouncedSearch),
            );

            // A newer request was sent while this one was in flight, so drop this result.
            if (requestId !== latestRequest.current) return;

            setProjects(data);
            setCounts(meta.counts);
        } catch {
            if (requestId === latestRequest.current) {
                setLoadError('Could not load projects. Is the API running?');
            }
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    }, [debouncedSearch, status, priority, overdue, sort]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(null), 3000);
        return () => clearTimeout(timer);
    }, [notice]);

    function openCreate() {
        setEditing(null);
        setFormOpen(true);
    }

    function openEdit(project) {
        setEditing(project);
        setFormOpen(true);
    }

    function openDelete(project) {
        setDeleting(project);
        setDeleteOpen(true);
    }

    // Reload rather than patching the list, so counts stay right and the active filters still apply.
    function handleSaved(_saved, wasEditing) {
        setFormOpen(false);
        setNotice(wasEditing ? 'Project updated.' : 'Project created.');
        loadProjects();
    }

    function handleDeleted() {
        setDeleteOpen(false);
        setNotice('Project deleted.');
        loadProjects();
    }

    const filtered = hasActiveFilters(filters);
    const firstLoad = loading && counts === null;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Projects" />

            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Client Projects</h1>
                        <p className="text-sm text-gray-500">
                            Track progress and priorities across all client work.
                        </p>
                    </div>
                    <PrimaryButton onClick={openCreate}>New project</PrimaryButton>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <SummaryCards counts={counts} filters={filters} onChange={setFilters} />

                {notice && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">
                        {notice}
                    </div>
                )}

                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <ProjectToolbar
                        filters={filters}
                        statuses={statuses}
                        priorities={priorities}
                        onChange={setFilters}
                    />

                    {firstLoad ? (
                        <div className="space-y-3 p-4" aria-label="Loading projects">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
                            ))}
                        </div>
                    ) : loadError ? (
                        <div className="p-8 text-center text-sm">
                            <p className="text-red-600">{loadError}</p>
                            <button
                                type="button"
                                onClick={loadProjects}
                                className="mt-2 font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                Try again
                            </button>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="p-12 text-center">
                            {filtered ? (
                                <>
                                    <p className="text-gray-900">No projects match your filters</p>
                                    <button
                                        type="button"
                                        onClick={() => setFilters({ ...defaultFilters, sort: filters.sort })}
                                        className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Clear filters
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-900">No projects yet</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Create your first project to start tracking it.
                                    </p>
                                    <PrimaryButton onClick={openCreate} className="mt-4">
                                        New project
                                    </PrimaryButton>
                                </>
                            )}
                        </div>
                    ) : (
                        // Dim the current list while a new filter result loads, instead of blanking it.
                        <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                            <div className="hidden md:block">
                                <ProjectTable projects={projects} onEdit={openEdit} onDelete={openDelete} />
                            </div>
                            <div className="md:hidden">
                                <ProjectCards projects={projects} onEdit={openEdit} onDelete={openDelete} />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ProjectFormModal
                show={formOpen}
                project={editing}
                statuses={statuses}
                priorities={priorities}
                onClose={() => setFormOpen(false)}
                onSaved={handleSaved}
            />

            <DeleteProjectModal
                show={deleteOpen}
                project={deleting}
                onClose={() => setDeleteOpen(false)}
                onDeleted={handleDeleted}
            />
        </div>
    );
}
