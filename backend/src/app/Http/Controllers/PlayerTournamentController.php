<?php

namespace App\Http\Controllers;

use App\Models\PlayerTournament;
use App\Rules\PlayerDivisionRule;
use App\Rules\PlayerOrdering;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PlayerTournamentController extends Controller
{
    public function get(Request $request): JsonResponse
    {
        $players = PlayerTournament::query();

        try {
            if ($request->validate(['tournament_id' => 'required|integer'])) {
                $players->where('tournament_id', '=', $request->get('tournament_id'));
            }

            if ($request->has('name') && $request->validate(['name' => 'required|string'])) {
                $players->where('name', 'like', '%' . $request->get('name') . '%');
            }

            if ($request->has('division') && $request->validate(['division' => ['required', 'string', new PlayerDivisionRule()]])) {
                $players->where('division', '=', $request->get('division'));
            }

            if ($request->has('placing') && $request->validate(['placing' => 'required|integer'])) {
                $players->where('placing', '=', $request->get('placing'));
            }

            if ($request->has('favs') && $request->validate(['favs' => 'required|integer']) && Auth::user() && $request->get('favs')) {
                $players->join('favs', 'favs.player_id', '=', 'players_tournaments.player_id');
                $players->where('favs.user_id', '=', Auth::user()->id);
            }

            if ($request->has('order') && $request->validate(['order' => ['required', 'string', new PlayerOrdering()]])) {
                $orderField = $request->get('order');
                $players->orderBy(trim($orderField, '-'), str_contains($orderField, '-') ? 'desc' : 'asc');
            }
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json($players->get());
    }

    public function getOne(int $id): JsonResponse
    {
        return response()->json(PlayerTournament::find($id));
    }
}
