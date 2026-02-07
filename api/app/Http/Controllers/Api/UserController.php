<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $currUser = $request->user();

        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'familyName' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($currUser->id),
            ],
        ]);

        $currUser->update([
            'first_name' => $validated['firstName'],
            'family_name' => $validated['familyName'],
            'email' => $validated['email'],
        ]);

        return response()->json([
            'user' => $currUser
        ], 200);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $currUser = $request->user();

        if($avatar_photo = $request->file('avatar')) {
            Storage::delete('public/' . $currUser->avatar);
            $newAvatar = $avatar_photo->store('users/' . $currUser->id, 'public');

            $currUser->update(['avatar' => $newAvatar]);
        }

        return response()->json([
            'user' => $currUser
        ], 200);
    }

    public function updatePassword(Request $request): JsonResponse
    {

    }
}
