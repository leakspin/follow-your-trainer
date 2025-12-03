<?php

namespace App\Console\Commands;

use App\Models\Player;
use App\Models\PlayerTournament;
use Illuminate\Console\Command;

class CreatePlayersFromTournaments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-players-from-tournaments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create players from tournaments or associate them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Getting players from tournaments');
        $playersTournament = PlayerTournament::where('player_id', null)->get();

        foreach ($playersTournament as $playerTournament) {
            $this->info(' Processing ' . $playerTournament->name);

            [$name, $country] = self::getNameAndCountryFromPokedataName($playerTournament->name);

            $this->info('  Name: ' . $name);
            $this->info('  Country: ' . $country ?? 'null');

            $player = Player::where('name', $name)->where('country', $country)->first();

            if (!$player) {
                $player = Player::create([
                    'name' => $name,
                    'country' => $country,
                ]);
                $player->save();
            }

            $playerTournament->player_id = $player->id;
            $playerTournament->save();
        }
    }

    public static function getNameAndCountryFromPokedataName($nameAndCountry, $withoutBraces = false)
    {
        preg_match($withoutBraces ? Player::CONVERSOR_COUNTRY_WITHOUT_BRACES_REGEX : Player::CONVERSOR_REGEX, $nameAndCountry, $nameMatches);

        if (isset($nameMatches[6], $nameMatches[7])) {
            return [$nameMatches[6], $nameMatches[7]];
        }

        return [$nameAndCountry, null];
    }
}
