<?php

use App\Models\Tournament;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('player_rounds', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('player1_id');
            $table->unsignedInteger('player2_id');
            $table->integer('round');
            $table->integer('table');
            $table->string('result');
            $table->foreignIdFor(Tournament::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_rounds');
    }
};
