<?php

namespace app\Http\Controllers\Admin;

use App\Enums\TournamentStructure;
use App\Http\Controllers\Controller;
use App\Models\Tournament;
use App\Rules\TournamentStructureRule;
use Illuminate\Http\Request;

class TournamentController extends Controller
{
    public function list()
    {
        return response()->json(Tournament::query()->orderBy('start_date', 'desc')->get());
    }

    public function getStructures()
    {
        return response()->json(TournamentStructure::cases());
    }

    public function update(Request $request, int $id)
    {
        $tournament = Tournament::find($id);

        if (!$tournament) {
            return response()->json(['error' => 'Tournament not found'], 404);
        }

        $this->validate($request, [
            'name' => ['string'],
            'structure' => ['string', new TournamentStructureRule()],
            'autoupdate' => ['boolean'],
        ]);

        $data = $request->only(['structure', 'autoupdate', 'name']);

        if (isset($data['name'])) {
            $tournament->name = $data['name'];
        }

        if (isset($data['structure'])) {
            $tournament->structure = $data['structure'];
        }

        if (isset($data['autoupdate'])) {
            $tournament->autoupdate = $data['autoupdate'];
        }

        $tournament->save();

        return response()->json($tournament);
    }
}
