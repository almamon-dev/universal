<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PageSpeedService
{
    protected string $apiKey;

    protected string $baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    public function __construct()
    {
        $this->apiKey = config('services.pagespeed.key') ?? '';
    }

    /**
     * Analyze a URL using Google PageSpeed Insights API
     *
     * @param  string  $strategy  'desktop' or 'mobile'
     */
    public function analyze(string $url, string $strategy = 'mobile'): array
    {
        try {
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::timeout(30)->get($this->baseUrl, [
                'url' => $url,
                'key' => $this->apiKey,
                'strategy' => $strategy,
                'category' => ['performance', 'accessibility', 'best-practices', 'seo'],
            ]);

            if (! $response->successful()) {
                Log::error('PageSpeed API Error: '.$response->body());

                return ['error' => 'Failed to fetch PageSpeed data.'];
            }

            $data = $response->json();

            return $this->formatResponse($data);
        } catch (\Exception $e) {
            Log::error('PageSpeed Service Exception: '.$e->getMessage());

            return ['error' => 'An error occurred while analyzing the page speed.'];
        }
    }

    /**
     * Format the raw API response into a simplified structure
     */
    protected function formatResponse(array $data): array
    {
        $lighthouse = $data['lighthouseResult'] ?? [];
        $categories = $lighthouse['categories'] ?? [];
        $audits = $lighthouse['audits'] ?? [];

        return [
            'scores' => [
                'performance' => ($categories['performance']['score'] ?? 0) * 100,
                'accessibility' => ($categories['accessibility']['score'] ?? 0) * 100,
                'best_practices' => ($categories['best-practices']['score'] ?? 0) * 100,
                'seo' => ($categories['seo']['score'] ?? 0) * 100,
            ],
            'metrics' => [
                'first_contentful_paint' => $audits['first-contentful-paint']['displayValue'] ?? 'N/A',
                'largest_contentful_paint' => $audits['largest-contentful-paint']['displayValue'] ?? 'N/A',
                'total_blocking_time' => $audits['total-blocking-time']['displayValue'] ?? 'N/A',
                'cumulative_layout_shift' => $audits['cumulative-layout_shift']['displayValue'] ?? 'N/A',
                'speed_index' => $audits['speed-index']['displayValue'] ?? 'N/A',
            ],
            'loading_experience' => $data['loadingExperience']['overall_category'] ?? 'UNKNOWN',
            'origin_loading_experience' => $data['originLoadingExperience']['overall_category'] ?? 'UNKNOWN',
            'screenshot' => $audits['final-screenshot']['details']['data'] ?? null,
        ];
    }
}
