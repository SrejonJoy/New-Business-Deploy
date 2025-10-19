<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class PromoteUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:promote {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote a user to admin by email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();
        if (! $user) {
            $this->error('User not found: ' . $email);
            return 1;
        }

        $user->role = 'admin';
        $user->save();
        $this->info('User promoted to admin: ' . $email);
        return 0;
    }
}
