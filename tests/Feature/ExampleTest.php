<?php

it('redirects the home page to projects', function () {
    $this->get('/')->assertRedirect('/projects');
});

it('sends guests to the login page', function () {
    $this->get('/projects')->assertRedirect('/login');
});
