export function formatDate(value) {
    if (!value) return '—';

    return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Due date as something a project manager can scan: "3 days overdue", "Due today", "In 5 days".
export function dueInfo(project) {
    if (!project.due_date) return { label: '—', className: 'text-gray-400' };

    if (project.status === 'Completed') {
        return { label: formatDate(project.due_date), className: 'text-gray-500' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((new Date(`${project.due_date}T00:00:00`) - today) / 86400000);

    if (days < 0) return { label: `${plural(-days, 'day')} overdue`, className: 'font-medium text-red-600' };
    if (days === 0) return { label: 'Due today', className: 'font-medium text-amber-600' };
    if (days <= 7) return { label: `In ${plural(days, 'day')}`, className: 'text-amber-600' };

    return { label: formatDate(project.due_date), className: 'text-gray-700' };
}
