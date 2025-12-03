<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    /**
     * This regex satisfies three different views of RK9 naming:
     *   - Adrian Mora [ES]
     *   - [ST1] Adrian Mora [ES]
     *   - >T323> Adrian Mora [ES]
     *   - Mikołaj Plich [PL]
     */
    // '/((\[[\p{L}0-9]+\] )|(\>[\p{L}0-9]+\> ))?([\p{L}\s]+) \[([A-Za-z]{2})\]/';
    public const CONVERSOR_REGEX = '/((\[[A-Za-z]+\s?[A-Z0-9]+\] )|(\>[A-Za-z0-9]+\>? )|(\>Table [0-9]+ )|(\>V[0-9]+ ))?(.+) \[([A-Za-z]{2})\]/';
    public const CONVERSOR_COUNTRY_WITHOUT_BRACES_REGEX = '/((\[[A-Za-z]+\s?[A-Z0-9]+\] )|(\>[A-Za-z0-9]+\>? )|(\>Table [0-9]+ )|(\>V[0-9]+ ))?(.+) ([A-Za-z]{2})/';

    protected $fillable = ['name', 'country'];

    public function playertournaments()
    {
        return $this->hasMany(PlayerTournament::class, 'player_id', 'id');
    }

    public function favs()
    {
        return $this->belongsToMany(User::class, 'favs', 'player_id', 'user_id');
    }
}
