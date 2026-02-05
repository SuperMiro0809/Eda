<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatSessionController;
use App\Http\Controllers\Api\MessageController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::apiResource('chat/sessions', ChatSessionController::class);

    Route::get('chat/sessions/{chatSession}/messages', [MessageController::class, 'index']);
    Route::post('chat/sessions/{chatSession}/messages', [MessageController::class, 'store']);
});
