<?php
namespace Database\Seeders;

use App\Models\QuestionDefault;
use Illuminate\Database\Seeder;

class QuestionDefaultSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            // NETWORK SPECIALIST - MINAT
            [
                'code' => 'NS1',
                'specialization' => 'network_specialist',
                'category' => 'interest',
                'question' => 'Saya tertarik mempelajari jaringan komputer.',
                'description' => 'Ketertarikan pada konsep dan teknologi jaringan komputer.',
            ],
            [
                'code' => 'NS2',
                'specialization' => 'network_specialist',
                'category' => 'interest',
                'question' => 'Saya tertarik mempelajari server dan infrastruktur IT.',
                'description' => 'Ketertarikan pada server dan infrastruktur teknologi informasi.',
            ],
            [
                'code' => 'NS3',
                'specialization' => 'network_specialist',
                'category' => 'interest',
                'question' => 'Saya tertarik mempelajari keamanan jaringan.',
                'description' => 'Ketertarikan pada network security.',
            ],
            [
                'code' => 'NS4',
                'specialization' => 'network_specialist',
                'category' => 'interest',
                'question' => 'Saya tertarik menyelesaikan masalah pada jaringan komputer.',
                'description' => 'Ketertarikan pada troubleshooting jaringan.',
            ],
            [
                'code' => 'NS5',
                'specialization' => 'network_specialist',
                'category' => 'interest',
                'question' => 'Saya tertarik mempelajari cloud computing dan virtualisasi.',
                'description' => 'Ketertarikan pada cloud computing dan virtualisasi.',
            ],
            [
                'code' => 'NS6',
                'specialization' => 'network_specialist',
                'category' => 'learning',
                'question' => 'Saya tertarik mempelajari konsep dasar jaringan komputer.',
                'description' => 'Ketertarikan mempelajari fundamental jaringan.',
            ],
            [
                'code' => 'NS7',
                'specialization' => 'network_specialist',
                'category' => 'learning',
                'question' => 'Saya tertarik mempelajari sistem operasi dan administrasi server.',
                'description' => 'Ketertarikan pada sistem operasi dan administrasi server.',
            ],
            [
                'code' => 'NS8',
                'specialization' => 'network_specialist',
                'category' => 'learning',
                'question' => 'Saya tertarik mempelajari konsep keamanan jaringan.',
                'description' => 'Ketertarikan mempelajari keamanan jaringan.',
            ],
            [
                'code' => 'NS9',
                'specialization' => 'network_specialist',
                'category' => 'learning',
                'question' => 'Saya tertarik melakukan konfigurasi dan troubleshooting jaringan.',
                'description' => 'Ketertarikan pada praktik konfigurasi dan pemecahan masalah jaringan.',
            ],
            [
                'code' => 'NS10',
                'specialization' => 'network_specialist',
                'category' => 'learning',
                'question' => 'Saya tertarik mempelajari penerapan cloud dan virtualisasi.',
                'description' => 'Ketertarikan mempelajari penerapan cloud dan virtualisasi.',
            ],

            // DATA SCIENCE - MINAT
            [
                'code' => 'DS1',
                'specialization' => 'data_science',
                'category' => 'interest',
                'question' => 'Saya tertarik menganalisis data.',
                'description' => 'Ketertarikan pada kegiatan analisis data.',
            ],
            [
                'code' => 'DS2',
                'specialization' => 'data_science',
                'category' => 'interest',
                'question' => 'Saya tertarik menemukan pola atau hubungan dalam data.',
                'description' => 'Ketertarikan menemukan pola dan hubungan dalam data.',
            ],
            [
                'code' => 'DS3',
                'specialization' => 'data_science',
                'category' => 'interest',
                'question' => 'Saya tertarik membuat prediksi berdasarkan data.',
                'description' => 'Ketertarikan pada prediksi berbasis data.',
            ],
            [
                'code' => 'DS4',
                'specialization' => 'data_science',
                'category' => 'interest',
                'question' => 'Saya tertarik menyajikan data dalam bentuk visualisasi.',
                'description' => 'Ketertarikan pada visualisasi data.',
            ],
            [
                'code' => 'DS5',
                'specialization' => 'data_science',
                'category' => 'interest',
                'question' => 'Saya tertarik mempelajari Artificial Intelligence dan Machine Learning.',
                'description' => 'Ketertarikan pada AI dan Machine Learning.',
            ],
            [
                'code' => 'DS6',
                'specialization' => 'data_science',
                'category' => 'learning',
                'question' => 'Saya tertarik mempelajari matematika dan statistika untuk analisis data.',
                'description' => 'Ketertarikan pada matematika dan statistika.',
            ],
            [
                'code' => 'DS7',
                'specialization' => 'data_science',
                'category' => 'learning',
                'question' => 'Saya tertarik menggunakan pemrograman untuk mengolah data.',
                'description' => 'Ketertarikan pada pemrograman untuk pengolahan data.',
            ],
            [
                'code' => 'DS8',
                'specialization' => 'data_science',
                'category' => 'learning',
                'question' => 'Saya tertarik membersihkan dan menyiapkan data sebelum dianalisis.',
                'description' => 'Ketertarikan pada data cleaning dan data preparation.',
            ],
            [
                'code' => 'DS9',
                'specialization' => 'data_science',
                'category' => 'learning',
                'question' => 'Saya tertarik melakukan analisis dan visualisasi data.',
                'description' => 'Ketertarikan pada analisis dan penyajian data.',
            ],
            [
                'code' => 'DS10',
                'specialization' => 'data_science',
                'category' => 'learning',
                'question' => 'Saya tertarik mempelajari algoritma Machine Learning.',
                'description' => 'Ketertarikan mempelajari dasar algoritma Machine Learning.',
            ],

            // GENERAL
            [
                'code' => 'U1',
                'specialization' => 'general',
                'category' => 'general',
                'question' => 'Saya tertarik menggunakan pemikiran logis untuk menyelesaikan masalah.',
                'description' => 'Ketertarikan pada pemikiran logis.',
            ],
            [
                'code' => 'U2',
                'specialization' => 'general',
                'category' => 'general',
                'question' => 'Saya tertarik mencari solusi ketika menghadapi suatu permasalahan.',
                'description' => 'Ketertarikan pada problem solving.',
            ],
            [
                'code' => 'U3',
                'specialization' => 'general',
                'category' => 'general',
                'question' => 'Saya tertarik melakukan pekerjaan yang membutuhkan ketelitian.',
                'description' => 'Ketertarikan pada pekerjaan yang membutuhkan ketelitian.',
            ],
            [
                'code' => 'U4',
                'specialization' => 'general',
                'category' => 'general',
                'question' => 'Saya tertarik mempelajari teknologi baru.',
                'description' => 'Ketertarikan pada proses belajar teknologi baru.',
            ],
            [
                'code' => 'U5',
                'specialization' => 'general',
                'category' => 'general',
                'question' => 'Saya tertarik menyampaikan hasil pekerjaan kepada orang lain.',
                'description' => 'Ketertarikan pada komunikasi dan penyampaian hasil.',
            ],
        ];

        foreach ($questions as $index => $question) {
            QuestionDefault::updateOrCreate(
                ['code' => $question['code']],
                array_merge($question, [
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ])
            );
        }
    }
}