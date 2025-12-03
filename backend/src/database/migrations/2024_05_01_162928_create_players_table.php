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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('division');
            $table->integer('wins');
            $table->integer('ties');
            $table->integer('losses');
            $table->integer('placing');
            $table->integer('drop');
            $table->foreignIdFor(Tournament::class);
            $table->integer('resistance');
            $table->integer('opponents_resistance');
            $table->integer('opponents_opponents_resistance');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
