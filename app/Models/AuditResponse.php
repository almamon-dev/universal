<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditResponse extends Model
{
    protected $guarded = [];

    public function audit()
    {
        return $this->belongsTo(SeoAudit::class, 'audit_id');
    }
}
