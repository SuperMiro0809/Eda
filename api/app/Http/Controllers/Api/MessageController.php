<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, ChatSession $chatSession): JsonResponse
    {
        if ($chatSession->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $messages = $chatSession->messages()->get();

        return response()->json([
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, ChatSession $chatSession): JsonResponse
    {
        if ($chatSession->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'role' => 'required|in:user,assistant',
            'content' => 'required|string',
        ]);

        $message = $chatSession->messages()->create($validated);

        // Update session's updated_at timestamp
        $chatSession->touch();

        return response()->json([
            'message' => $message,
        ], 201);
    }
}
