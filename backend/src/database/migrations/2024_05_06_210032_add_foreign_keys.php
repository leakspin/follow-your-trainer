<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('player_rounds', function (Blueprint $table) {
            $table->foreign('player1_id')->references('id')->on('players');
            $table->foreign('player2_id')->references('id')->on('players');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('player_rounds', function (Blueprint $table) {
            $table->dropForeign('player1_id');
            $table->dropForeign('player2_id');
        });
    }
};
