import PrimaryButton from '@/Components/PrimaryButton';
import DeleteProjectModal from '@/Components/Projects/DeleteProjectModal';
import ProjectFormModal from '@/Components/Projects/ProjectFormModal';
import ProjectTable from '@/Components/Projects/ProjectTable';
import { getProjects } from '@/api/projects';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ statuses, priorities }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [notice, setNotice] = useState(null);

    // Selected project stays set while a modal closes, so its content doesn't flicker.
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(null);

    async function loadProjects() {
        setLoading(true);
        setLoadError(null);

        try {
            setProjects(await getProjects());
        } catch {
            setLoadError('Could not load projects. Is the API running?');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProjects();
    }, []);

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

    function handleSaved(saved, wasEditing) {
        setProjects((current) =>
            wasEditing
                ? current.map((p) => (p.id === saved.id ? saved : p))
                : [saved, ...current],
        );
        setFormOpen(false);
        setNotice(wasEditing ? 'Project updated.' : 'Project created.');
    }

    function handleDeleted(deleted) {
        setProjects((current) => current.filter((p) => p.id !== deleted.id));
        setDeleteOpen(false);
        setNotice('Project deleted.');
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Projects" />

            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Client Projects</h1>
                        <p className="text-sm text-gray-500">
                            Track progress and priorities across all client work.
                        </p>
                    </div>
                    <PrimaryButton onClick={openCreate}>New project</PrimaryButton>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {notice && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                        {notice}
                    </div>
                )}

                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    {loading ? (
                        <p className="p-8 text-center text-sm text-gray-500">Loading projects…</p>
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
                            <p className="text-gray-900">No projects yet</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Create your first project to start tracking it.
                            </p>
                        </div>
                    ) : (
                        <ProjectTable projects={projects} onEdit={openEdit} onDelete={openDelete} />
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
