<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fav extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'player_id'];

    protected $hidden = ['id', 'user_id', 'created_at', 'updated_at'];
}
