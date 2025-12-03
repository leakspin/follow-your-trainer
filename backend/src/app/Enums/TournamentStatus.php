<?php

namespace App\Enums;

enum TournamentStatus: string
{
    case RUNNING = 'running';

    case FINISHED = 'finished';
    case NOT_STARTED = 'not-started';
}
