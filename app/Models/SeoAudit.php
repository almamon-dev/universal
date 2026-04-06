<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoAudit extends Model
{
    protected $guarded = [];

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

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function responses()
    {
        return $this->hasMany(AuditResponse::class, 'audit_id');
    }
}
