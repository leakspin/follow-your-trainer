<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function update(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'player_id' => 'exists:App\Models\Player,id',
        ]);

        $data = $request->only(['name', 'player_id']);

        $id = \Auth::user()->getAuthIdentifier();
        $user = User::find($id);
        $user->name = $data['name'];
        $user->player_id = $data['player_id'];

        $user->save();

        \Auth::setUser($user->with(['player'])->first());

        return response()->json(\Auth::user());
    }
}
