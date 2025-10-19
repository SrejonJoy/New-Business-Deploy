<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

class AssignDefaultRoleOnLogin
{
    /**
     * Handle the event.
     *
     * @param  \Illuminate\Auth\Events\Login  $event
     * @return void
     */
    public function handle(Login $event)
    {
        $user = $event->user;

        // If role is empty, assign the default 'user' role. Admins will be set manually via phpMyAdmin.
        if (empty($user->role)) {
            $user->role = 'user';
            // Save quietly to avoid triggering events again
            $user->save();
        }
    }
}
