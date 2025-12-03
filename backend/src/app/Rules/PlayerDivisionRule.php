<?php

namespace App\Rules;

use App\Enums\PlayerDivision;
use Illuminate\Contracts\Validation\ValidationRule;

class PlayerDivisionRule implements ValidationRule
{
    #[\Override]
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        if (!\in_array($value, array_column(PlayerDivision::cases(), 'value'))) {
            $fail('The :attribute must be one of the following: ' . implode(', ', array_column(PlayerDivision::cases(), 'value')));
        }
    }
}
