<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\Message;
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
            'content' => 'nullable|string',
        ]);

        // Set default empty string if content is null (for streaming placeholders)
        $validated['content'] = $validated['content'] ?? '';

        $message = $chatSession->messages()->create($validated);

        // Update session's updated_at timestamp
        $chatSession->touch();

        return response()->json([
            'message' => $message,
        ], 201);
    }

    public function update(Request $request, ChatSession $chatSession, Message $message): JsonResponse
    {
        if ($chatSession->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        if ($message->chat_session_id !== $chatSession->id) {
            abort(404, 'Message not found in this session');
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $message->update($validated);

        return response()->json([
            'message' => $message,
        ]);
    }
}
