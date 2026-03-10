<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    protected $guarded = [];

    public function qcs()
    {
        return $this->hasMany(User::class)->where('role', 'qc');
    }

    protected $casts = [
        'audit_fields' => 'array',
        'discovery_data' => 'array',
    ];

    public function chatters()
    {
        return $this->hasMany(Chatter::class);
    }

    public function creators()
    {
        return $this->hasMany(Creator::class);
    }

    public function audits()
    {
        return $this->hasManyThrough(SeoAudit::class, User::class);
    }
}
