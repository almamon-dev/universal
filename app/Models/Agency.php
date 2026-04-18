<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    protected $guarded = [];

    protected $casts = [

    ];

    public function auditFields()
    {
        return $this->belongsToMany(AuditField::class, 'agency_audit_field')
            ->withPivot('sort_order')
            ->orderBy('sort_order');
    }

    public function protocols()
    {
        return $this->hasMany(Protocol::class);
    }

    public function discoveryProgress()
    {
        return $this->hasMany(DiscoveryProgress::class);
    }

    public function qcs()
    {
        return $this->hasMany(User::class)->where('role', 'qc');
    }

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
