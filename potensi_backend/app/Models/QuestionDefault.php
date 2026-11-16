<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionDefault extends Model
{
    protected $table = 'questions_default';

    protected $fillable = [
        'code',
        'specialization',
        'category',
        'question',
        'description',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function responses(): HasMany
    {
        return $this->hasMany(QuestionResponse::class, 'question_default_id');
    }
}