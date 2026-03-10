<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebsiteService
{
    /**
     * Fetch basic content and metadata from a URL
     */
    public function fetchContent(string $url): array
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            ])
                ->withoutVerifying() // Disable SSL verification for local/compatibility issues
                ->timeout(15)
                ->get($url);

            if (! $response->successful()) {
                return ['error' => 'Could not reach the website (Status: '.$response->status().').'];
            }

            $html = $response->body();

            // Extract Title (Robust Regex)
            $title = '';
            if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $matches)) {
                $title = $matches[1];
            }

            // Extract Meta Description (Supports name="description" or property="og:description")
            $description = '';
            if (preg_match('/<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']/is', $html, $matches) ||
                preg_match('/<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']/is', $html, $matches)) {
                $description = $matches[1];
            } elseif (preg_match('/<meta[^>]*property=["\']og:description["\'][^>]*content=["\'](.*?)["\']/is', $html, $matches)) {
                $description = $matches[1];
            }

            // Extract Keywords
            $keywords = '';
            if (preg_match('/<meta[^>]*name=["\']keywords["\'][^>]*content=["\'](.*?)["\']/is', $html, $matches)) {
                $keywords = $matches[1];
            }

            // Extract body text
            $text = strip_tags($html);
            $text = preg_replace('/\s+/', ' ', $text);
            $text = mb_substr(trim($text), 0, 3000);

            // Extract Headings
            $headings = [];
            preg_match_all('/<h[1-6][^>]*>(.*?)<\/h[1-6]>/is', $html, $hMatches);
            if (! empty($hMatches[1])) {
                $headings = array_slice($hMatches[1], 0, 15);
            }

            // Image and Link Count
            $imageCount = preg_match_all('/<img/i', $html, $unused);
            $linkCount = preg_match_all('/<a\s+href/i', $html, $unused);

            return [
                'url' => $url,
                'title' => html_entity_decode(trim($title)),
                'description' => html_entity_decode(trim($description)),
                'keywords' => trim($keywords),
                'content' => $text,
                'headings' => implode(', ', array_map(fn ($h) => trim(strip_tags($h)), $headings)),
                'image_count' => $imageCount,
                'link_count' => $linkCount,
                'status_code' => $response->status(),
                'html' => $html, // Keep HTML for link extraction
            ];
        } catch (\Exception $e) {
            Log::error('Website Fetch Error: ['.$url.'] '.$e->getMessage());

            return ['error' => 'Failed to fetch website content: '.$e->getMessage()];
        }
    }

    /**
     * Extract internal links from a page
     */
    public function getInternalLinks(string $baseUrl, string $html): array
    {
        $links = [];
        $domain = parse_url($baseUrl, PHP_URL_HOST);
        $scheme = parse_url($baseUrl, PHP_URL_SCHEME);

        // Match both href="url" and href='url'
        preg_match_all('/href=["\']([^"\']+)["\']/i', $html, $matches);

        if (! empty($matches[1])) {
            foreach ($matches[1] as $url) {
                // 1. Basic cleanup & skip common assets
                if (str_starts_with($url, '#') || str_starts_with($url, 'javascript:') ||
                    str_contains($url, 'mailto:') || str_contains($url, 'tel:') ||
                    preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|pdf|woff|woff2|json)$/i', $url)) {
                    continue;
                }

                // 2. Handle relative URLs
                if (str_starts_with($url, '/')) {
                    $url = $scheme.'://'.$domain.$url;
                } elseif (! str_starts_with($url, 'http')) {
                    $url = rtrim($baseUrl, '/').'/'.$url;
                }

                // 3. Normalize URL (Remove query strings)
                $url = rtrim(explode('?', $url)[0], '/');

                // 4. Check if it's the same domain
                $urlHost = parse_url($url, PHP_URL_HOST);
                if ($urlHost === $domain) {
                    $links[] = $url;
                }
            }
        }

        $uniqueLinks = array_values(array_unique($links));

        // Prioritize common pages: About, Skills, Projects, etc.
        usort($uniqueLinks, function ($a, $b) {
            $keywords = ['about', 'skills', 'projects', 'service', 'contact', 'portfolio'];
            foreach ($keywords as $word) {
                if (str_contains(strtolower($a), $word)) {
                    return -1;
                }
                if (str_contains(strtolower($b), $word)) {
                    return 1;
                }
            }

            return 0;
        });

        return array_slice($uniqueLinks, 0, 6);
    }
}
