// Each card is a shortcut filter. Counts come from the API and always cover all projects.
const cards = [
    { key: 'in_progress', label: 'In Progress', filter: { status: 'In Progress' }, color: 'text-blue-700' },
    { key: 'on_hold', label: 'On Hold', filter: { status: 'On Hold' }, color: 'text-amber-700' },
    { key: 'overdue', label: 'Overdue', filter: { overdue: true }, color: 'text-red-600' },
    { key: 'completed', label: 'Completed', filter: { status: 'Completed' }, color: 'text-green-700' },
];

function isActive(card, filters) {
    return card.filter.overdue ? filters.overdue : filters.status === card.filter.status;
}

export default function SummaryCards({ counts, filters, onChange }) {
    function toggle(card) {
        const cleared = { ...filters, status: '', overdue: false };
        onChange(isActive(card, filters) ? cleared : { ...cleared, ...card.filter });
    }

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((card) => {
                const active = isActive(card, filters);

                return (
                    <button
                        key={card.key}
                        type="button"
                        onClick={() => toggle(card)}
                        aria-pressed={active}
                        className={`rounded-lg bg-white p-4 text-left shadow-sm transition hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${active ? 'ring-2 ring-indigo-500' : ''}`}
                    >
                        <p className="text-sm text-gray-500">{card.label}</p>
                        {counts ? (
                            <p className={`mt-1 text-2xl font-semibold ${card.color}`}>{counts[card.key]}</p>
                        ) : (
                            <div className="mt-2 h-7 w-10 animate-pulse rounded bg-gray-200" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
