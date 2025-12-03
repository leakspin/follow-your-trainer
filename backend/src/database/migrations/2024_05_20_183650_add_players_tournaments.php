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
        Schema::table('tournaments', function (Blueprint $table) {
            $table->addColumn('integer', 'masters_players', ['default' => 0]);
            $table->addColumn('integer', 'seniors_players', ['default' => 0]);
            $table->addColumn('integer', 'juniors_players', ['default' => 0]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn(['masters_players', 'seniors_players', 'juniors_players']);
        });
    }
};
