<?php

namespace App\Rules;

use app\Enums\TournamentStatus;
use Illuminate\Contracts\Validation\ValidationRule;

class TournamentStatusRule implements ValidationRule
{
    #[\Override]
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        if (!\in_array($value, array_column(TournamentStatus::cases(), 'value'))) {
            $fail('The :attribute must be one of the following: ' . implode(', ', array_column(TournamentStatus::cases(), 'value')));
        }
    }
}
