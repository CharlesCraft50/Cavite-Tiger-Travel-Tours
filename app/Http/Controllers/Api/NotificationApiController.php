<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use Carbon\Carbon;

class NotificationApiController extends Controller
{
    /**
     * Get notifications for a user.
     */
    public function index($userId)
    {
        $notifications = Notification::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllAsRead($userId)
    {
        Notification::where('user_id', $userId)
            ->whereNull('read_at') // only unread
            ->update(['read_at' => Carbon::now()]);

        return response()->json(['status' => 'success']);
    }
}
