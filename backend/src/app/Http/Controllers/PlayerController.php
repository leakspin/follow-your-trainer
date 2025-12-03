<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function getOne(int $id)
    {
        return response()->json(Player::find($id));
    }

    public function getOneWithTournaments(int $id)
    {
        return response()->json(Player::where('id', $id)->with(['playertournaments'])->first());
    }

    public function search(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        $name = $request->get('name');

        $searchName = str_replace(' ', '%', $name);
        $players = Player::where('name', 'like', '%' . $searchName . '%')->limit(5);

        return response()->json($players->get());
    }
}
