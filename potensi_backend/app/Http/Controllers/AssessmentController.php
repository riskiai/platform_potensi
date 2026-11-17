<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\QuestionDefault;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AssessmentController extends Controller
{
    /**
     * Menyimpan assessment beserta seluruh jawaban mahasiswa.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('role', 'company');

        // Hanya mahasiswa (participant) yang dapat mengirim assessment.
        if ($user->role?->slug !== 'participant') {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya mahasiswa yang dapat mengirim assessment.',
            ], 403);
        }

        // Pastikan mahasiswa sudah terdaftar pada perusahaan/instansi.
        if (! $user->company_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun mahasiswa belum terdaftar pada perusahaan atau instansi.',
            ], 422);
        }

        // Validasi struktur dan jumlah jawaban.
        $validator = Validator::make($request->all(), [
            'answers' => ['required', 'array', 'size:25'],
            'answers.*' => ['required', 'array'],
            'answers.*.question_id' => [
                'required',
                'integer',
                'distinct',
                'exists:questions_default,id',
            ],
            'answers.*.answer' => [
                'required',
                'integer',
                'between:1,5',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data jawaban tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $answers = $request->input('answers');

        // Pastikan semua pertanyaan yang dikirim merupakan pertanyaan aktif.
        $questionIds = collect($answers)
            ->pluck('question_id')
            ->map(fn ($id) => (int) $id);

        $activeQuestionIds = QuestionDefault::query()
            ->where('is_active', true)
            ->whereIn('id', $questionIds)
            ->pluck('id')
            ->map(fn ($id) => (int) $id);

        if ($activeQuestionIds->count() !== 25) {
            return response()->json([
                'status' => 'error',
                'message' => 'Semua jawaban harus mengacu pada 25 pertanyaan aktif.',
            ], 422);
        }

        // Pastikan jumlah pertanyaan aktif sesuai ketentuan sistem.
        $totalActiveQuestions = QuestionDefault::where('is_active', true)->count();

        if ($totalActiveQuestions !== 25) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jumlah pertanyaan aktif belum sesuai dengan ketentuan sistem.',
            ], 422);
        }

        // Simpan assessment dan jawaban dalam satu transaksi.
        $assessment = DB::transaction(function () use ($user, $answers) {
            $assessment = Assessment::create([
                'company_id' => $user->company_id,
                'user_id' => $user->id,
                'status' => 'completed',
                'started_at' => now(),
                'completed_at' => now(),
            ]);

            $responses = collect($answers)->map(function ($item) {
                return [
                    'question_default_id' => $item['question_id'],
                    'answer' => $item['answer'],
                ];
            })->all();

            $assessment->responses()->createMany($responses);

            return $assessment->load('responses');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Assessment berhasil disimpan.',
            'data' => [
                'assessment_id' => $assessment->id,
                'status' => $assessment->status,
                'total_answers' => $assessment->responses->count(),
                'completed_at' => $assessment->completed_at,
            ],
        ], 201);
    }

    /**
     * Menampilkan detail assessment milik mahasiswa yang sedang login.
     */
    public function show(Request $request, Assessment $assessment): JsonResponse
    {
        // Batasi akses hanya untuk pemilik assessment.
        $assessment = Assessment::query()
            ->where('user_id', $request->user()->id)
            ->with([
                'responses.question' => function ($query) {
                    $query->select(
                        'id',
                        'code',
                        'specialization',
                        'category',
                        'question'
                    );
                },
            ])
            ->findOrFail($assessment->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Detail assessment berhasil diambil.',
            'data' => [
                'assessment_id' => $assessment->id,
                'status' => $assessment->status,
                'started_at' => $assessment->started_at,
                'completed_at' => $assessment->completed_at,
                'total_answers' => $assessment->responses->count(),
                'answers' => $assessment->responses
                    ->sortBy(fn ($response) => $response->question->id)
                    ->values()
                    ->map(fn ($response) => [
                        'question_id' => $response->question_default_id,
                        'code' => $response->question->code,
                        'specialization' => $response->question->specialization,
                        'category' => $response->question->category,
                        'question' => $response->question->question,
                        'answer' => $response->answer,
                    ]),
            ],
        ]);
    }
}
