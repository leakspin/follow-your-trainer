<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;

class PlayerOrdering implements ValidationRule
{
    #[\Override]
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        $order = ['placing', '-placing'];

        if (!\in_array($value, $order)) {
            $fail('The :attribute must be one of the following: ' . implode(', ', $order));
        }
    }
}
