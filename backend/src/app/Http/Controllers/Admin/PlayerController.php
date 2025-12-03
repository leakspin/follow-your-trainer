<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fav;
use App\Models\Player;
use App\Models\PlayerTournament;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PlayerController extends Controller
{
    public function merge(Request $request)
    {
        $request->validate([
            'player_to_stay_id' => 'required|integer|exists:players,id',
            'player_to_fuse_id' => 'required|integer|exists:players,id',
        ]);

        $data = $request->only(['player_to_stay_id', 'player_to_fuse_id']);

        if ($data['player_to_stay_id'] === $data['player_to_fuse_id']) {
            return response()->json(['errors' => 'IDs must not be equal'], Response::HTTP_BAD_REQUEST);
        }

        \DB::transaction(function () use ($data) {
            Fav::query()->where('player_id', $data['player_to_fuse_id'])->update(['player_id' => $data['player_to_stay_id']]);
            PlayerTournament::query()->where('player_id', $data['player_to_fuse_id'])->update(['player_id' => $data['player_to_stay_id']]);
            User::query()->where('player_id', $data['player_to_fuse_id'])->update(['player_id' => $data['player_to_stay_id']]);
            Player::find($data['player_to_fuse_id'])->delete();
        });

        return response()->json(Player::find($data['player_to_stay_id']));
    }

    public function modify(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'player_id' => 'required|integer|exists:players,id',
        ]);

        $data = $request->only(['name', 'country', 'player_id']);

        $player = Player::find($data['player_id']);
        $player->name = $data['name'];
        $player->country = $data['country'];
        $player->save();

        return response()->json($player);
    }
}
