<?php

namespace App\Models;

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'client_name',
        'project_name',
        'description',
        'status',
        'priority',
        'start_date',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'status' => ProjectStatus::class,
            'priority' => ProjectPriority::class,
            'start_date' => 'date',
            'due_date' => 'date',
        ];
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        return $query->when($term, fn($q) => $q->where(function ($q) use ($term) {
            $q->where('client_name', 'like', "%{$term}%")
                ->orWhere('project_name', 'like', "%{$term}%");
        }));
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereDate('due_date', '<', today())
            ->where('status', '!=', ProjectStatus::Completed);
    }

    public function scopeSortBy(Builder $query, ?string $sort): Builder
    {
        $sort = $sort ?: '-created_at';
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');

        // Priority is stored as text, so give it a real order: Low < Medium < High
        if ($column === 'priority') {
            return $query->orderByRaw(
                "CASE priority WHEN 'Low' THEN 1 WHEN 'Medium' THEN 2 WHEN 'High' THEN 3 END {$direction}"
            );
        }

        // Projects without a date go last in either direction, not first.
        if (in_array($column, ['start_date', 'due_date'])) {
            $query->orderByRaw("{$column} IS NULL");
        }

        return $query->orderBy($column, $direction);
    }
}
