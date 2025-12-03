<?php

namespace App\Console\Commands;

use App\Enums\TournamentStatus;
use App\Helper\DataHelper;
use App\Models\PlayerRound;
use App\Models\PlayerTournament;
use App\Models\Tournament;
use GuzzleHttp\Client;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;

class PopulateFromPokedata extends Command implements Isolatable
{
    protected const GAMES = ['tcg'];
    protected const TOURNAMENTS_URLS = 'http://pokedata.ovh/apiv2/{game}/tournaments';
    protected const TOURNAMENT_URLS = 'http://pokedata.ovh/apiv2/{game}/id/{id}';

    protected Client $guzzleClient;
    protected DataHelper $dataHelper;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:populate-from-pokedata
        {--tournaments : Update all tournaments information}
        {--tournament= : Internal Tournament ID to update data}
        {--running : Update running tournaments data}
        {--remove-question-marks : Remove rounds with question marks}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate data from Pokédata';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->guzzleClient = new Client();
        $this->dataHelper = new DataHelper($this->output);

        if ($this->option('tournaments')) {
            foreach (self::GAMES as $game) {
                $tournamentsRequest = $this->guzzleClient->request('GET', $this->getTournamentsUrl($game));

                if (200 == $tournamentsRequest->getStatusCode()) {
                    $tournaments = json_decode($tournamentsRequest->getBody()->getContents(), true);

                    foreach ($tournaments[$game]['data'] as $tournamentData) {
                        $this->info('Populating tournament: ' . $tournamentData['name']);
                        $tournament = Tournament::where([
                            'rk9link' => $tournamentData['rk9link'],
                            'game' => $game,
                            'start_date' => $tournamentData['date']['start'],
                        ])->first();

                        if (!$tournament) {
                            /** @var Tournament $tournament */
                            $tournament = Tournament::create([
                                'rk9link' => $tournamentData['rk9link'],
                                'game' => $game,
                                'start_date' => $tournamentData['date']['start'],
                                'name' => $tournamentData['name'],
                                'end_date' => $tournamentData['date']['end'],
                                'status' => $tournamentData['tournamentStatus'],
                                'masters_players' => $tournamentData['players']['masters'] ?? 0,
                                'seniors_players' => $tournamentData['players']['seniors'] ?? 0,
                                'juniors_players' => $tournamentData['players']['juniors'] ?? 0,
                                'pokedata_id' => $tournamentData['id'],
                                'structure' => Tournament::DEFAULT_STRUCTURE,
                            ]);
                        } elseif ($tournament->autoupdate) {
                            // @var Tournament $tournament
                            $tournament->update([
                                'end_date' => $tournamentData['date']['end'],
                                'status' => $tournamentData['tournamentStatus'],
                                'masters_players' => $tournamentData['players']['masters'] ?? 0,
                                'seniors_players' => $tournamentData['players']['seniors'] ?? 0,
                                'juniors_players' => $tournamentData['players']['juniors'] ?? 0,
                                'pokedata_id' => $tournamentData['id'],
                            ]);

                            if (!$tournament->structure) {
                                $tournament->structure = Tournament::DEFAULT_STRUCTURE;
                                $tournament->save();
                            }

                            if (!$tournament->name) {
                                $tournament->name = $tournamentData['name'];
                                $tournament->save();
                            }
                        } else {
                            $this->info('  Autoupdate disabled');
                        }
                    }
                } else {
                    $this->error('Error while retrieving tournament list data. HTTP error code: ' . $tournamentsRequest->getStatusCode());
                }
            }
        } elseif ($this->option('tournament')) {
            $tournament = Tournament::find($this->option('tournament'));

            if ($tournament) {
                $this->updateTournamentPlayers($tournament);
            }
        } elseif ($this->option('running')) {
            foreach (self::GAMES as $game) {
                $tournaments = Tournament::where('status', 'running')->where('game', $game)->get();

                foreach ($tournaments as $tournament) {
                    $this->updateTournamentPlayers($tournament);
                }
            }
        } elseif ($this->option('remove-question-marks')) {
            PlayerRound::where('result', '?')->delete();
        } else {
            $this->warn('No option given, command won\'t do anything.');
        }
    }

    protected function updateTournamentPlayers(Tournament $tournament)
    {
        $tournamentDataRequest = $this->guzzleClient->get($this->getTournamentUrl($tournament->game, $tournament->rk9link));

        if (200 == $tournamentDataRequest->getStatusCode()) {
            $tournamentData = json_decode($tournamentDataRequest->getBody()->getContents(), true);

            if (isset($tournamentData['tournament_data'])) {
                foreach ($tournamentData['tournament_data'] as $tournamentDivison) {
                    $this->info('Populating tournament division: ' . $tournamentDivison['division']);

                    if (isset($tournamentDivison['data'])) {
                        $this->dataHelper->processTournamentPlayers($tournament, $tournamentDivison['data'], $tournamentDivison['division']);
                    }
                }

                $this->call('app:create-players-from-tournaments');
                $this->cleanPlayers($tournament);
            }
        } else {
            $this->error('Error while retrieving tournament data. HTTP error code: ' . $tournamentDataRequest->getStatusCode());
        }
    }

    protected function cleanPlayers(Tournament $tournament)
    {
        $this->info('Cleaning players');

        if (TournamentStatus::FINISHED === $tournament->status) {
            $players = PlayerTournament::where(function ($query) use ($tournament) {
                $query->where(['placing' => 0, 'tournament_id' => $tournament->id]);
            })->orWhere(function ($query) use ($tournament) {
                $query->where(['wins' => 0, 'ties' => 0, 'losses' => 0, 'tournament_id' => $tournament->id]);
            })->get();

            foreach ($players as $player) {
                if (0 == PlayerRound::where(['player1_id', $player->id])->count()) {
                    $this->info('  Deleting player: ' . $player->name);
                    $player->delete();
                }
            }
        }
    }

    protected function getTournamentsUrl(string $game): string
    {
        return preg_replace('/{game}/', $game, self::TOURNAMENTS_URLS);
    }

    protected function getTournamentUrl(string $game, string $id): string
    {
        $url = preg_replace('/{game}/', $game, self::TOURNAMENT_URLS);

        return preg_replace('/{id}/', $id, $url);
    }
}
