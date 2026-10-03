import { PriorityBadge, StatusBadge, priorityStripe } from './Badges';
import { dueInfo, formatDate } from './dates';
import ProjectActions from './ProjectActions';

// Mobile layout: one card per project instead of a sideways-scrolling table.
export default function ProjectCards({ projects, onEdit, onDelete }) {
    return (
        // Not divide-y: its border colour would override the priority stripe on the left.
        <ul>
            {projects.map((project) => {
                const due = dueInfo(project);

                return (
                    <li
                        key={project.id}
                        onClick={() => onEdit(project)}
                        className={`cursor-pointer border-b border-l-4 border-b-gray-100 p-4 last:border-b-0 hover:bg-gray-50 ${priorityStripe[project.priority]}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-medium text-gray-900">{project.project_name}</p>
                                <p className="text-sm text-gray-500">{project.client_name}</p>
                            </div>
                            <ProjectActions project={project} onEdit={onEdit} onDelete={onDelete} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                            <StatusBadge status={project.status} />
                            <PriorityBadge priority={project.priority} />
                            <span className={`ml-auto ${due.className}`} title={formatDate(project.due_date)}>
                                {due.label}
                            </span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
