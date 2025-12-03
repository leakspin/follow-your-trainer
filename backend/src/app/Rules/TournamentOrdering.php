<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;

class TournamentOrdering implements ValidationRule
{
    #[\Override]
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        $order = ['name', 'start_date', 'status', '-name', '-start_date', '-status'];

        if (!\in_array($value, $order)) {
            $fail('The :attribute must be one of the following: ' . implode(', ', $order));
        }
    }
}
