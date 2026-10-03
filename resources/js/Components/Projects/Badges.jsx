const statusStyles = {
    Planning: 'bg-slate-100 text-slate-700 ring-slate-200',
    'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
    'On Hold': 'bg-amber-50 text-amber-700 ring-amber-200',
    Completed: 'bg-green-50 text-green-700 ring-green-200',
};

const priorityStyles = {
    Low: 'bg-gray-50 text-gray-600 ring-gray-200',
    Medium: 'bg-orange-50 text-orange-700 ring-orange-200',
    High: 'bg-red-50 text-red-700 ring-red-200',
};

// Left border colour so urgent work stands out when scanning the list.
export const priorityStripe = {
    Low: 'border-l-transparent',
    Medium: 'border-l-orange-400',
    High: 'border-l-red-500',
};

function Badge({ className, children }) {
    return (
        <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
        >
            {children}
        </span>
    );
}

export function StatusBadge({ status }) {
    return <Badge className={statusStyles[status]}>{status}</Badge>;
}

export function PriorityBadge({ priority }) {
    return <Badge className={priorityStyles[priority]}>{priority}</Badge>;
}
