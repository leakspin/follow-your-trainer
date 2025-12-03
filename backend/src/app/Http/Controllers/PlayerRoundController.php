<?php

namespace App\Http\Controllers;

use App\Models\PlayerRound;
use App\Rules\PlayerRoundOrdering;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PlayerRoundController extends Controller
{
    public function get(Request $request): JsonResponse
    {
        $playerRounds = PlayerRound::query();

        try {
            if ($request->validate(['player1_id' => 'required|integer'])) {
                $playerRounds->where('player1_id', '=', $request->get('player1_id'));
            }

            if ($request->has('player2_id') && $request->validate(['player2_id' => 'required|integer'])) {
                $playerRounds->where('player2_id', '=', $request->get('player2_id'));
            }

            if ($request->has('tournament_id') && $request->validate(['tournament_id' => 'required|integer'])) {
                $playerRounds->where('tournament_id', '=', $request->get('tournament_id'));
            }

            if ($request->has('order') && $request->validate(['order' => ['required', 'string', new PlayerRoundOrdering()]])) {
                $orderField = $request->get('order');
                $playerRounds->orderBy(trim($orderField, '-'), str_contains($orderField, '-') ? 'desc' : 'asc');
            }
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json($playerRounds->with('player1', 'player2')->get());
    }
}
