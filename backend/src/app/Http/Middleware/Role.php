<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     * @param Request                                                                          $request
     * @param array                                                                            $roles
     */
    public function handle(Request $request, \Closure $next, ...$roles): Response
    {
        if (!\Auth::user()) {
            return response()->json(['errors' => ['Unauthorized.']], Response::HTTP_UNAUTHORIZED);
        }

        if (\in_array('admin', $roles, true) && !\Auth::user()->isAdmin()) {
            return response()->json(['errors' => ['Unauthorized.']], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
