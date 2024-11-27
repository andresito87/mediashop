<?php

use App\Console\Commands\CartShop;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// cronjob to send a reminder to the user about the products in their cart
app(Schedule::class)->command('reminder:cart-shop')->cron('0 */6 * * *');
