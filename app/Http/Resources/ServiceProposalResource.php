<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceProposalResource extends JsonResource
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
            'proposed_timeline' => collect($this->timeline)->map(function ($phase, $index) {
                return [
                    'phase_tag' => 'Phase '.str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                    'phase_number' => str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                    'title' => $phase['title'] ?? null,
                    'timeframe' => $phase['duration'] ?? null,
                    'investment' => $phase['price'] ?? null,
                    'tasks' => $phase['items'] ?? [],
                ];
            }),
            'pricing' => \App\Http\Resources\PricingPlanResource::collection(\App\Models\PricingPlan::where('status', true)->get()),
        ];
    }
}
