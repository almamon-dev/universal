<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'thumbnail' => $this->thumbnail ? asset($this->thumbnail) : [],

            // Video
            'video' => [
                'file' => ($this->video_url && ! filter_var($this->video_url, FILTER_VALIDATE_URL)) ? asset($this->video_url) : [],
                'url' => ($this->video_url && filter_var($this->video_url, FILTER_VALIDATE_URL)) ? $this->video_url : [],
            ],

            // Pricing Plans
            'pricing' => \App\Http\Resources\PricingPlanResource::collection(\App\Models\PricingPlan::where('status', true)->get()),

            // What's Included
            'what_include' => collect($this->benefits)->map(function ($benefit) {
                return [
                    'title' => $benefit['title'] ?? null,
                    'description' => $benefit['description'] ?? null,
                    'icon' => isset($benefit['icon']) ? asset($benefit['icon']) : null,
                    'points' => $benefit['points'] ?? [],
                ];
            }),

            // Monthly Process Steps
            'our_monthly_process' => collect($this->process_steps)->map(function ($step, $index) {
                return [
                    'step_number' => $index + 1,
                    'title' => $step['title'] ?? null,
                    'description' => $step['description'] ?? null,
                    'icon' => isset($step['icon']) ? asset($step['icon']) : null,
                ];
            }),

            // Content Section One (Mapped to 'banifite' as requested)
            'banifite' => [
                'badge' => $this->section_one['subtitle'] ?? 'Analysis',
                'title' => $this->section_one['title'] ?? null,
                'description' => $this->section_one['description'] ?? null,
                'points' => $this->section_one['points'] ?? [],
                'image' => isset($this->section_one['image']) ? asset($this->section_one['image']) : null,
                'button_text' => $this->section_one['button_text'] ?? null,
                'button_url' => $this->section_one['button_url'] ?? null,
            ],

            // Content Section Two (Mapped to 'why_chose_us' as requested)
            'why_chose_us' => [
                'badge' => $this->section_two['subtitle'] ?? 'Strategy',
                'title' => $this->section_two['title'] ?? null,
                'description' => $this->section_two['description'] ?? null,
                'points' => $this->section_two['points'] ?? [],
                'image' => isset($this->section_two['image']) ? asset($this->section_two['image']) : [],
                'button_text' => $this->section_two['button_text'] ?? null,
                'button_url' => $this->section_two['button_url'] ?? null,
            ],

            // FAQs
            'faq' => collect($this->faqs)->map(function ($faq) {
                return [
                    'question' => $faq['question'] ?? [],
                    'answer' => $faq['answer'] ?? [],
                ];
            }),

            // Proposed Timeline & Investment
            'timeline' => collect($this->timeline)->map(function ($phase, $index) {
                return [
                    'phase_number' => str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                    'title' => $phase['title'] ?? null,
                    'duration' => $phase['duration'] ?? null,
                    'price' => $phase['price'] ?? null,
                    'items' => $phase['items'] ?? [],
                ];
            }),

            // Expected Results
            'expect_results' => collect($this->expect_results)->map(function ($result) {
                return [
                    'title' => $result['title'] ?? null,
                    'value' => $result['value'] ?? null,
                    'subtitle' => $result['subtitle'] ?? null,
                    'icon' => $result['icon'] ?? 'ArrowUpRight',
                ];
            }),

            'status' => (bool) $this->status,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
