<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/about/index');
    }

    public function certifications()
    {
        return Inertia::render('dashboard/about/certifications');
    }

    public function termsAndConditions()
    {
        return Inertia::render('dashboard/about/terms-and-conditions');
    }

    public function privacyPolicy()
    {
        return Inertia::render('dashboard/about/privacy-policy');
    }

    public function cancellationPolicy()
    {
        return Inertia::render('dashboard/about/cancellation-policy');
    }
}
