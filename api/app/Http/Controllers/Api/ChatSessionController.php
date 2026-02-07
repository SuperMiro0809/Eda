<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatSessionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sessions = $request->user()
            ->chatSessions()
            ->select('id', 'title', 'created_at', 'updated_at')
            ->get();

        return response()->json([
            'sessions' => $sessions,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
        ]);

        $session = $request->user()->chatSessions()->create([
            'title' => $validated['title'] ?? 'New Chat',
        ]);

        return response()->json([
            'session' => $session,
        ], 201);
    }

    public function show(Request $request, ChatSession $session): JsonResponse
    {
        if ($session->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $session->load('messages');

        return response()->json([
            'session' => $session,
        ]);
    }

    public function update(Request $request, ChatSession $session): JsonResponse
    {
        if ($session->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $session->update($validated);

        return response()->json([
            'session' => $session,
        ]);
    }

    public function destroy(Request $request, ChatSession $session): JsonResponse
    {
        if ($session->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $session->delete();

        return response()->json([
            'message' => 'Session deleted successfully',
        ]);
    }
}
