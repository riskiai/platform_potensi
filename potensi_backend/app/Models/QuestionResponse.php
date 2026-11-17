<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionResponse extends Model
{
    protected $fillable = [
        'assessment_id',
        'question_default_id',
        'answer',
    ];

    protected function casts(): array
    {
        return [
            'answer' => 'integer',
        ];
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(
            QuestionDefault::class,
            'question_default_id'
        );
    }
}