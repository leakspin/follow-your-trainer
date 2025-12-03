<?php

namespace App\Console\Commands;

use App\Models\Player;
use Illuminate\Console\Command;

class PossiblePlayersNameProblems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:possible-players-name-problems';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check database for possible player names problems';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $manualFixing = [];

        \DB::connection()->getPdo()->sqliteCreateFunction('REGEXP', 'preg_match', 2);
        $playersWithStrangeCharacters = \DB::table('players')->whereRaw('REGEXP("/^[\[<>]/", players.name)')->get();

        foreach ($playersWithStrangeCharacters as $player) {
            $this->info('Checking ' . $player->id . ': ' . $player->name);
            [$name, $country] = CreatePlayersFromTournaments::getNameAndCountryFromPokedataName($player->name . ' ' . $player->country);

            if (!$country) {
                $this->info(' No country detected, let\'s use the other regex: ' . $name);
                [$name, $country] = CreatePlayersFromTournaments::getNameAndCountryFromPokedataName($player->name . ' ' . $player->country, true);

                if (!$country) {
                    $this->info(' No country detected, manual fixing: ' . $name);
                    $manualFixing[] = $player->id;
                } else {
                    $this->info(' Name and country found! Continuing...');
                }
            }

            $possibleDuplicates = Player::where('name', $name)->where('player_id', '!=', $player->id)->get();

            if ($possibleDuplicates->count() > 0) {
                $this->info('  Possible duplicates found!');

                foreach ($possibleDuplicates as $possibleDuplicate) {
                    $this->info('    ' . $possibleDuplicate->id . ': ' . $possibleDuplicate->name);
                }
            }
        }
    }
}
