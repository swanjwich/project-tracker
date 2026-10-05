<?php

use App\Models\Project;
use App\Models\User;

it('rejects guests on every project endpoint', function (string $method, string $uri) {
    Project::factory()->create(['id' => 1]);

    $this->json($method, $uri)->assertUnauthorized();
})->with([
    ['GET', '/api/projects'],
    ['GET', '/api/projects/1'],
    ['POST', '/api/projects'],
    ['PUT', '/api/projects/1'],
    ['DELETE', '/api/projects/1'],
]);

it('lets a logged-in user list projects', function () {
    Project::factory()->count(3)->create();

    $this->actingAs(User::factory()->create())
        ->getJson('/api/projects')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('shows the projects page to a logged-in user', function () {
    $this->actingAs(User::factory()->create())
        ->get('/projects')
        ->assertOk();
});
