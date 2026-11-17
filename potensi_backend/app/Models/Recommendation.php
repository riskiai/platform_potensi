<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recommendation extends Model
{
    protected $fillable = [
        'assessment_id',
        'recommended_specialization',
        'network_specialist_score',
        'data_science_score',
        'model_version',
        'status',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'network_specialist_score' => 'float',
            'data_science_score' => 'float',
        ];
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }
}