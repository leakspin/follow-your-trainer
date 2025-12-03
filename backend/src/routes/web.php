<?php

use App\Http\Controllers\Admin\PlayerController as AdminPlayerController;
use App\Http\Controllers\Admin\TournamentController as AdminTournamentController;
use App\Http\Controllers\FavsController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\PlayerRoundController;
use App\Http\Controllers\PlayerTournamentController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::group([
    'prefix' => 'tournament',
    'controller' => TournamentController::class,
], function () {
    Route::get('/', 'get');
    Route::get('/{id}', 'getOne');
});

Route::group([
    'prefix' => 'playertournament',
    'controller' => PlayerTournamentController::class,
], function () {
    Route::get('/', 'get');
    Route::get('/{id}', 'getOne');
});

Route::group([
    'prefix' => 'player',
    'controller' => PlayerController::class,
], function () {
    Route::get('/search', 'search');
    Route::get('/{id}', 'getOne');
    Route::get('/{id}/tournaments', 'getOneWithTournaments');
});

Route::group([
    'prefix' => 'playerround',
    'controller' => PlayerRoundController::class,
], function () {
    Route::get('/', 'get');
});

Route::group(['prefix' => 'auth'], function () {
    Route::get('/redirect', function () {
        return Socialite::driver('google')->redirect();
    });
    Route::get('/callback', function () {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id', $googleUser->getId())->first();

        if ($user) {
            $user->update([
                'email' => $googleUser->email,
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
            ]);
        } else {
            $user = User::create([
                'google_id' => $googleUser->id,
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
            ]);
        }

        Auth::login($user);

        return redirect(to: getenv('FRONT_URL_CALLBACK'));
    });
    Route::group([
        'middleware' => 'auth',
    ], function () {
        Route::get('/user', function () {
            return response()->json(Auth::user());
        });
        Route::get('/logout', function () {
            Auth::logout();

            return response()->json();
        });
    });
});

Route::group([
    'prefix' => 'user',
    'middleware' => 'auth',
    'controller' => UserController::class,
], function () {
    Route::post('/', 'update');
});

Route::group([
    'prefix' => 'fav',
    'middleware' => 'auth',
    'controller' => FavsController::class,
], function () {
    Route::get('/', 'get');
    Route::get('/add/{playerId}', 'add');
    Route::get('/remove/{playerId}', 'remove');
});

Route::group([
    'prefix' => 'admin',
    'middleware' => 'role:admin',
], function () {
    Route::group([
        'prefix' => 'player',
        'controller' => AdminPlayerController::class,
    ], function () {
        Route::post('/merge', 'merge');
        Route::post('/modify', 'modify');
    });

    Route::group([
        'prefix' => 'tournament',
        'controller' => AdminTournamentController::class,
    ], function () {
        Route::get('/list', 'list');
        Route::get('/structures', 'getStructures');
        Route::post('/{id}', 'update');
    });
});
