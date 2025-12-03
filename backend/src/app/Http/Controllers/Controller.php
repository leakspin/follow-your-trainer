<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;

abstract class Controller extends \Illuminate\Routing\Controller
{
    use AuthorizesRequests;
    use ValidatesRequests;

    public function __construct(
        Request $request,
        protected $page = 1,
        protected $perPage = 15,
    ) {
        if ($request->has('page')) {
            $this->page = $request->get('page');
        }

        if ($request->has('per_page')) {
            $this->perPage = $request->get('per_page');
        }
    }
}
