<?php

namespace App\Models;

use App\Enums\TournamentStructure;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    public const DEFAULT_STRUCTURE = TournamentStructure::WORLDS2024;

    protected $fillable = ['rk9link', 'name', 'game', 'start_date', 'end_date', 'status', 'masters_players', 'seniors_players', 'juniors_players', 'pokedata_id', 'structure'];
}
