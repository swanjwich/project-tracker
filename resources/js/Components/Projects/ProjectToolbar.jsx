import TextInput from '@/Components/TextInput';
import SelectInput from './SelectInput';

export const defaultFilters = {
    search: '',
    status: '',
    priority: '',
    overdue: false,
    sort: '-created_at',
};

const sortOptions = [
    ['-created_at', 'Newest first'],
    ['due_date', 'Due date (soonest)'],
    ['-due_date', 'Due date (latest)'],
    ['-priority', 'Priority (high first)'],
    ['priority', 'Priority (low first)'],
];

export function hasActiveFilters(filters) {
    return Boolean(filters.search || filters.status || filters.priority || filters.overdue);
}

export default function ProjectToolbar({ filters, statuses, priorities, onChange }) {
    const set = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

    return (
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center">
            <TextInput
                type="search"
                value={filters.search}
                onChange={set('search')}
                placeholder="Search client or project…"
                aria-label="Search projects"
                className="w-full text-sm lg:w-72"
            />

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                <SelectInput value={filters.status} onChange={set('status')} aria-label="Filter by status" className="text-sm">
                    <option value="">All statuses</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </SelectInput>

                <SelectInput value={filters.priority} onChange={set('priority')} aria-label="Filter by priority" className="text-sm">
                    <option value="">All priorities</option>
                    {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </SelectInput>

                <SelectInput
                    value={filters.sort}
                    onChange={set('sort')}
                    aria-label="Sort projects"
                    className="col-span-2 text-sm sm:col-span-1"
                >
                    {sortOptions.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </SelectInput>
            </div>

            {hasActiveFilters(filters) && (
                <button
                    type="button"
                    onClick={() => onChange({ ...defaultFilters, sort: filters.sort })}
                    className="self-start text-sm font-medium text-indigo-600 hover:text-indigo-800 lg:ml-auto lg:self-center"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}
