import { PriorityBadge, StatusBadge, priorityStripe } from './Badges';
import { dueInfo, formatDate } from './dates';
import ProjectActions from './ProjectActions';

export default function ProjectTable({ projects, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="border-l-4 border-l-transparent px-4 py-3">Project</th>
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
                    {projects.map((project) => {
                        const due = dueInfo(project);

                        return (
                            <tr
                                key={project.id}
                                onClick={() => onEdit(project)}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                <td className={`max-w-xs border-l-4 px-4 py-3 ${priorityStripe[project.priority]}`}>
                                    <div className="font-medium text-gray-900">{project.project_name}</div>
                                    {project.description && (
                                        <div className="truncate text-gray-500">{project.description}</div>
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
                                    className={`whitespace-nowrap px-4 py-3 ${due.className}`}
                                    title={formatDate(project.due_date)}
                                >
                                    {due.label}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <ProjectActions project={project} onEdit={onEdit} onDelete={onDelete} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
