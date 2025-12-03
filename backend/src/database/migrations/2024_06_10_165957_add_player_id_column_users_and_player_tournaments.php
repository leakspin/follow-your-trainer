<?php

use App\Models\Player;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignIdFor(Player::class)->nullable();
        });
        Schema::table('players_tournaments', function (Blueprint $table) {
            $table->foreignIdFor(Player::class)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('player_id');
        });
        Schema::table('players_tournaments', function (Blueprint $table) {
            $table->dropColumn('player_id');
        });
    }
};
