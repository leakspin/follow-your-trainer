<?php

namespace App\Helper;

use App\Console\Commands\CreatePlayersFromTournaments;
use App\Models\Player;
use App\Models\PlayerRound;
use App\Models\PlayerTournament;
use App\Models\Tournament;
use Illuminate\Console\Concerns\InteractsWithIO;

class DataHelper
{
    use InteractsWithIO {
        info as public infoTrait;
    }

    protected bool $command;

    public function __construct($output = null, $command = true)
    {
        $this->output = $output;
        $this->command = $command;
    }

    public function info($string, $verbosity = null)
    {
        if ($this->command) {
            $this->infoTrait($string, $verbosity);
        } else {
            echo $string . PHP_EOL;
        }
    }

    public function processTournamentPlayers(Tournament $tournament, array $playersRawData, string $division)
    {
        $players = [];

        foreach ($playersRawData as $playerRawData) {
            $this->info('Populating player: ' . $playerRawData['name']);

            [$name, $country] = CreatePlayersFromTournaments::getNameAndCountryFromPokedataName($playerRawData['name']);

            if (!$country) {
                [$name, $country] = CreatePlayersFromTournaments::getNameAndCountryFromPokedataName($playerRawData['name'], true);
            }

            $player = Player::firstOrNew([
                'name' => $name,
                'country' => $country,
            ]);

            if (!$player->exists()) {
                $playerWithName = Player::firstWhere('name', $name);

                if ($playerWithName) {
                    $player = $playerWithName;
                }
            }

            $playerTournament = PlayerTournament::updateOrCreate([
                'division' => $division,
                'name' => $playerRawData['name'],
                'tournament_id' => $tournament->id,
                'player_id' => $player->id,
            ], [
                'wins' => $playerRawData['record']['wins'],
                'losses' => $playerRawData['record']['losses'],
                'ties' => $playerRawData['record']['ties'],
                'placing' => $playerRawData['placing'],
                'drop' => $playerRawData['drop'],
                'resistance' => (int) ($playerRawData['resistances']['self'] * 10000),
                'opponents_resistance' => (int) ($playerRawData['resistances']['opp'] * 10000),
                'opponents_opponents_resistance' => (int) ($playerRawData['resistances']['oppopp'] * 10000),
                'points' => (($playerRawData['record']['wins'] * 3) + $playerRawData['record']['ties']),
            ]);

            $players[$playerRawData['name']] = $playerTournament->id;
        }

        foreach ($playersRawData as $playerRawData) {
            $this->info('Populating player rounds: ' . $playerRawData['name']);
            $player = PlayerTournament::find($players[$playerRawData['name']]);

            if ($player) {
                $this->updateOrInsertPlayerRound($player, $playerRawData['rounds']);
            }
        }
    }

    protected function updateOrInsertPlayerRound(PlayerTournament $player, array $rounds)
    {
        foreach ($rounds as $roundNumber => $round) {
            $this->info('  Populating round: ' . $roundNumber);
            $opponent = PlayerTournament::where('name', $round['name'])->where('division', $player->division)->where('tournament_id', $player->tournament_id);

            if ($opponent->exists()) {
                $opponent = $opponent->first();

                PlayerRound::where('player1_id', $player->id)
                    ->where('round', $roundNumber)
                    ->where('player2_id', '!=', $opponent->id)
                    ->where('tournament_id', $player->tournament_id)
                    ->delete();

                PlayerRound::updateOrCreate([
                    'player1_id' => $player->id,
                    'player2_id' => $opponent->id,
                    'round' => $roundNumber,
                    'tournament_id' => $player->tournament_id,
                ], [
                    'table' => $round['table'],
                    'result' => $round['result'] ?? '?',
                ]);
            }
        }
    }
}
