<?php

namespace App\Models\Sale;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Sale extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        "user_id",
        "method_payment",
        "currency_total",
        "currency_payment",
        "discount",
        "subtotal",
        "total",
        "price_dolar",
        "code_transaction",
        "description"
    ];

    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set("Europe/Madrid");
        $this->attributes["created_at"] = Carbon::now();
    }

    public function setUpdatedAtAttribute($value)
    {
        date_default_timezone_set("Europe/Madrid");
        $this->attributes["updated_at"] = Carbon::now();
    }

    // a sale could have many sale details
    public function sale_details()
    {
        return $this->hasMany(SaleDetail::class);
    }

    // a sale has only one address
    public function sale_addres()
    {
        return $this->hasOne(SaleAddres::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeFilterAdvanceAdmin(
        $query,
        $search,
        $start_date,
        $end_date,
        $brand_id,
        $categorie_first_id,
        $categorie_second_id,
        $categorie_third_id,
        $method_payment
    ) {
        if ($search) {
            $query->whereHas("user", function ($q) use ($search) {
                $q->where(
                    DB::raw(
                        "CONCAT(users.name,' ',IFNULL(users.surname,''),' ',users.email, ' ',IFNULL(users.phone,''))"
                    ),
                    "like",
                    "%" . $search . "%"
                );
            });
        }

        if ($start_date && $end_date) {
            $query->whereBetween(
                [
                    "created_at",
                    [
                        Carbon::parse($start_date)->format("Y-m-d") . " 00:00:00",
                        Carbon::parse($end_date)->format("Y-m-d") . " 23:59:59"
                    ]
                ]
            );
        }

        // The query is accessing data from one model to another through relationships such as hasMany, belongsTo, etc
        if ($brand_id) {
            $query->whereHas("sale_details", function ($q) use ($brand_id) {
                $q->whereHas("product", function ($sub_q) use ($brand_id) {
                    $sub_q->where("brand_id", $brand_id);
                });
            });

        }

        if ($categorie_first_id || $categorie_second_id || $categorie_third_id) {
            $query->whereHas("sale_details", function ($q) use ($categorie_first_id, $categorie_second_id, $categorie_third_id) {
                $q->whereHas("product", function ($sub_q) use ($categorie_first_id, $categorie_second_id, $categorie_third_id) {
                    if ($categorie_first_id) {
                        $sub_q->where("categorie_first_id", $categorie_first_id);
                    }
                    if ($categorie_second_id) {
                        $sub_q->where("categorie_second_id", $categorie_second_id);
                    }
                    if ($categorie_third_id) {
                        $sub_q->where("categorie_third_id", $categorie_third_id);
                    }
                });
            });
        }

        if ($method_payment) {
            $query->where("method_payment", $method_payment);
        }

        return $query;
    }
}
