<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-3 months', '+1 month');

        return [
            'client_name'  => fake()->company(),
            'project_name' => fake()->randomElement(['Website Redesign', 'Mobile App', 'SEO Campaign', 'Brand Identity', 'E-commerce Store', 'CRM Integration']),
            'description'  => fake()->optional()->paragraph(),
            'status'       => fake()->randomElement(ProjectStatus::cases()),
            'priority'     => fake()->randomElement(ProjectPriority::cases()),
            'start_date'   => $start,
            'due_date'     => fake()->dateTimeBetween($start, (clone $start)->modify('+4 months')),
        ];
    }
}
