<?php

namespace App\Console\Commands;

use App\Mail\CartReminder;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class CartShop extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminder:cart-shop';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a reminder email every six hours for two days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        date_default_timezone_set('Europe/Madrid');

        $users = User::whereHas("carts", function ($query) {
            $query->whereRaw("DATEDIFF(updated_at,created_at) < 3"); // every 2 days
        })->get();

        foreach ($users as $key => $user) {
            foreach ($user->carts as $cart) {
                $cart->update([
                    "updated_at" => now()
                ]);
            }

            Mail::to($user->email)->send(new CartReminder($user, $user->carts));
        }

        // dd($users);
    }
}
