<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VanAvailabilityService;

class VanApiController extends Controller
{
    protected $availabilityService;

    public function __construct(VanAvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    public function availability($vanId)
    {
        return response()->json(
            $this->availabilityService->getAvailableDateRanges($vanId)
        );
    }
}
