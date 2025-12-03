<?php

namespace app\Rules;

use Illuminate\Contracts\Validation\ValidationRule;

class PlayerRoundOrdering implements ValidationRule
{
    #[\Override]
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        $order = ['round', '-round'];

        if (!\in_array($value, $order)) {
            $fail('The :attribute must be one of the following: ' . implode(', ', $order));
        }
    }
}
