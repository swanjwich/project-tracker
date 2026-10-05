<?php

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guests get sent to the login page by the auth middleware on /projects.
Route::redirect('/', '/projects');

Route::middleware('auth')->group(function () {
    Route::get('/projects', function () {
        return Inertia::render('Projects/Index', [
            'statuses' => array_column(ProjectStatus::cases(), 'value'),
            'priorities' => array_column(ProjectPriority::cases(), 'value'),
        ]);
    })->name('projects');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
