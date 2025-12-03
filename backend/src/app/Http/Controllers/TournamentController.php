<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Rules\TournamentGamesRule;
use App\Rules\TournamentOrdering;
use App\Rules\TournamentStatusRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TournamentController extends Controller
{
    public function get(Request $request): JsonResponse
    {
        $tournaments = Tournament::query();

        try {
            if ($request->has('rk9link') && $request->validate(['rk9link' => ['required', 'string']])) {
                $tournaments->where('rk9link', '=', $request->get('rk9link'));
            }

            if ($request->has('name') && $request->validate(['name' => 'required|string'])) {
                $tournaments->where('name', 'like', '%' . $request->get('name') . '%');
            }

            if ($request->has('game') && $request->validate(['game' => ['required', 'string', new TournamentGamesRule()]])) {
                $tournaments->where('game', '=', $request->get('game'));
            }

            if ($request->has('start_date') && $request->validate(['start_date' => 'required|string|date'])) {
                $tournaments->whereDate('start_date', '=', $request->get('start_date'));
            }

            if ($request->has('status') && $request->validate(['status' => ['required', 'string', new TournamentStatusRule()]])) {
                $tournaments->where('status', '=', $request->get('status'));
            }

            if ($request->has('order') && $request->validate(['order' => ['required', 'string', new TournamentOrdering()]])) {
                $orderField = $request->get('order');
                $tournaments->orderBy(trim($orderField, '-'), str_contains($orderField, '-') ? 'desc' : 'asc');
            }
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        // Fixed perPage for tournaments
        $tournaments->forPage($this->page, 5);

        return response()->json($tournaments->get());
    }

    public function getOne(int $id): JsonResponse
    {
        return response()->json(Tournament::find($id));
    }
}
