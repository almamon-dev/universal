<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoAudit extends Model
{
    protected $fillable = [
        'user_id',
        'chatter_id',
        'creator_id',
        'subscriber_uid',
        'email',
        'url',
        'status',
        'response_data',
    ];

    protected $casts = [
        'response_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chatter()
    {
        return $this->belongsTo(Chatter::class);
    }

    public function creator()
    {
        return $this->belongsTo(Creator::class);
    }
}
