<?php

namespace App\Console\Commands;

use App\Enums\PlayerDivision;
use App\Helper\DataHelper;
use App\Models\Tournament;
use Illuminate\Console\Command;

class ImportJSON extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:json
        {--json= : JSON File}
        {--tournament= : Tournament ID of the file}
        {--division= : Division of the file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import JSON data as tournament data';

    protected DataHelper $dataHelper;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->dataHelper = new DataHelper($this->output);
        $jsonData = null;
        $tournament = null;
        $division = null;

        if ($this->option('json')) {
            if (!file_exists($this->option('json'))) {
                $this->error('JSON file not found');

                throw new \Exception('JSON file not found');
            }

            $jsonData = json_decode(file_get_contents($this->option('json')), true);
        } else {
            throw new \Exception('JSON file not found');
        }

        if ($this->option('tournament')) {
            $tournament = Tournament::find($this->option('tournament'));

            if (!$tournament) {
                $this->error('Tournament not found');

                throw new \Exception('Tournament not found');
            }
        } else {
            throw new \Exception('Tournament not found');
        }

        if ($this->option('division')) {
            if (!\in_array($this->option('division'), array_column(PlayerDivision::cases(), 'value'))) {
                $this->error('Division not found');

                throw new \Exception('Division not found');
            }

            $division = $this->option('division');
        } else {
            throw new \Exception('Division not found');
        }

        $this->dataHelper->processTournamentPlayers($tournament, $jsonData, $division);
    }
}
