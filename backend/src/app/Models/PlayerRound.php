<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerRound extends Model
{
    use HasFactory;

    protected $fillable = ['player1_id', 'player2_id', 'round', 'table', 'result', 'tournament_id'];

    public function player1()
    {
        return $this->belongsTo(PlayerTournament::class);
    }

    public function player2()
    {
        return $this->belongsTo(PlayerTournament::class);
    }
}
