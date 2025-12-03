<?php

namespace App\Http\Controllers;

use App\Models\Fav;
use Illuminate\Support\Facades\Auth;

class FavsController extends Controller
{
    public function add(int $playerId)
    {
        return response()->json(Fav::firstOrCreate(['player_id' => $playerId, 'user_id' => Auth::user()->id]));
    }

    public function remove(int $playerId)
    {
        return response()->json(['removed' => Fav::where('player_id', $playerId)->where('user_id', Auth::user()->id)->delete()]);
    }

    public function get()
    {
        return response()->json(Fav::where('user_id', Auth::user()->id)->get());
    }
}
