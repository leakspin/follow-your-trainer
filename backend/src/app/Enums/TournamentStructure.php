<?php

namespace App\Enums;

enum TournamentStructure: string
{
    case REG2024 = 'reg2024';
    case WORLDS2024 = 'worlds2024';
    case REG2025 = 'reg2025';
    case REG2025_20241117 = 'reg2025-20241117';
    case CUP = 'cup';
    case CHALLENGE = 'challenge';
}
