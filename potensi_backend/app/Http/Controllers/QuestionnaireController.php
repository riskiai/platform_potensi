<?php

namespace App\Http\Controllers;

use App\Models\QuestionDefault;
use Illuminate\Http\JsonResponse;

class QuestionnaireController extends Controller
{
    /**
     * Mengambil seluruh pertanyaan aktif untuk kuesioner.
     */
    public function index(): JsonResponse
    {
        $questions = QuestionDefault::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get([
                'id',
                'code',
                'specialization',
                'category',
                'question',
                'description',
                'sort_order',
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data pertanyaan berhasil diambil.',
            'data' => [
                'total' => $questions->count(),
                'questions' => $questions,
            ],
        ]);
    }
}
