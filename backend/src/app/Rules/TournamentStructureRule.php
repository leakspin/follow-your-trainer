<?php

namespace App\Rules;

use App\Enums\TournamentStructure;
use Illuminate\Contracts\Validation\ValidationRule;

class TournamentStructureRule implements ValidationRule
{
    #[\Override]
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        if (!\in_array($value, array_column(TournamentStructure::cases(), 'value'))) {
            $fail('The :attribute must be one of the following: ' . implode(', ', array_column(TournamentStructure::cases(), 'value')));
        }
    }
}
