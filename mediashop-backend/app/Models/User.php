<?php

namespace App\Models;

use App\Models\Sale\Cart;
use App\Models\Sale\UserAddres;
use Tymon\JWTAuth\Contracts\JWTSubject;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'surname',
        'type_user',
        'avatar',
        'phone',
        'email',
        'unique_id',
        'code_verified',
        'password',
        'email_verified_at',

        "address_city",
        "biography",
        "fbLink",
        "gender"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // a user could have many items in the cart
    public function carts()
    {
        return $this->hasMany(Cart::class, 'user_id');
    }

    // a user could have many addresses
    public function address()
    {
        return $this->hasMany(UserAddres::class, 'user_id');
    }
}
