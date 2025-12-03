<?php

namespace App\Console\Commands;

use App\Models\Fav;
use App\Models\Player;
use App\Models\PlayerTournament;
use App\Models\User;
use Illuminate\Console\Command;

class FusionPlayers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fusion-players
        {playerToStay : Player ID that stays in the db}
        {playerToFusion : Player ID to fusion}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fusion two players';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $playerIDToStay = $this->argument('playerToStay');
        $playerIDToFusion = $this->argument('playerToFusion');

        $playerToStay = Player::find($playerIDToStay);

        if (!$playerToStay) {
            $this->error('Player to stay not found');
        }

        $playerToFusion = Player::find($playerIDToFusion);

        if (!$playerToFusion) {
            $this->error('Player to fusion not found');
        }

        $this->info('You are going to fuse these two players:');
        $this->info('  To be kept: ' . $playerToStay->id . ' - ' . $playerToStay->name . ' [' . $playerToStay->country . ']');
        $this->info('  To be fused: ' . $playerToFusion->id . ' - ' . $playerToFusion->name . ' [' . $playerToFusion->country . ']');

        if ($this->confirm('Do you want to continue?')) {
            \DB::transaction(function () use ($playerToFusion, $playerToStay) {
                Fav::query()->where('player_id', $playerToFusion->id)->update(['player_id' => $playerToStay->id]);
                PlayerTournament::query()->where('player_id', $playerToFusion->id)->update(['player_id' => $playerToStay->id]);
                User::query()->where('player_id', $playerToFusion->id)->update(['player_id' => $playerToStay->id]);
            });

            $this->info('Seems like fusion has been done, please check before continuing');

            if ($this->confirm('Do you wish to delete the player?')) {
                $playerToFusion->delete();
                $this->info('Player deleted successfully');
            }
        }
    }
}
