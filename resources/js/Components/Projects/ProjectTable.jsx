import { PriorityBadge, StatusBadge } from './Badges';

function formatDate(value) {
    if (!value) return '—';

    return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function isOverdue(project) {
    if (!project.due_date || project.status === 'Completed') return false;

    return new Date(`${project.due_date}T23:59:59`) < new Date();
}

export default function ProjectTable({ projects, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Start</th>
                        <th className="px-4 py-3">Due</th>
                        <th className="px-4 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                            <td className="max-w-xs px-4 py-3">
                                <div className="font-medium text-gray-900">
                                    {project.project_name}
                                </div>
                                {project.description && (
                                    <div className="truncate text-gray-500">
                                        {project.description}
                                    </div>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                {project.client_name}
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={project.status} />
                            </td>
                            <td className="px-4 py-3">
                                <PriorityBadge priority={project.priority} />
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                {formatDate(project.start_date)}
                            </td>
                            <td
                                className={`whitespace-nowrap px-4 py-3 ${isOverdue(project) ? 'font-medium text-red-600' : 'text-gray-700'}`}
                            >
                                {formatDate(project.due_date)}
                                {isOverdue(project) && (
                                    <span className="ml-1 text-xs">(overdue)</span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                <button
                                    type="button"
                                    onClick={() => onEdit(project)}
                                    className="font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(project)}
                                    className="ml-4 font-medium text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
