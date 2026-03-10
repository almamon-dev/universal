<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricingPlanResource extends JsonResource
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
            'name' => $this->name,
            'price' => $this->price,
            'subtitle' => $this->subtitle,
            'is_popular' => $this->is_popular,
            'features' => $this->features,
            'button_text' => $this->button_text,
            'status' => $this->status,
        ];
    }
}
