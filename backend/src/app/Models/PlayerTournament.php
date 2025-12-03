<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerTournament extends Model
{
    use HasFactory;

    protected $table = 'players_tournaments';

    protected $fillable = ['name', 'division', 'wins', 'ties', 'losses', 'placing', 'drop', 'tournament_id', 'resistance', 'opponents_resistance', 'opponents_opponents_resistance', 'points', 'player_id'];

    protected $with = ['player', 'tournament'];

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }
}
