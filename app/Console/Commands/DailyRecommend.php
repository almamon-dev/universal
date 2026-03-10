<?php

namespace App\Console\Commands;

use App\Models\Recipe;
use App\Models\RecommendationSchedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DailyRecommend extends Command
{
    protected $signature = 'recommend:daily';

    protected $description = 'Generate daily meal recommendations';

    public function handle()
    {
        $today = Carbon::today()->toDateString();
        $mealTypes = ['breakfast', 'lunch', 'dinner'];

        $this->info("Starting recommendation generation for $today...");

        // 1. Generate Global Recommendations (user_id = null) - DISABLED
        // foreach ($mealTypes as $type) {
        // ... (removed)
        // }
        User::chunk(100, function ($users) use ($today, $mealTypes) {
            foreach ($users as $user) {
                foreach ($mealTypes as $type) {
                    // Check if schedule already exists for this user
                    $exists = RecommendationSchedule::where('scheduled_for', $today)
                        ->where('meal_type', $type)
                        ->where('user_id', $user->id)
                        ->exists();

                    if (!$exists) {
                        $recipeToRecommend = null;

                        // 1. Try to find a favorite for this meal type
                        $favorite = Recipe::whereHas('favorites', function ($q) use ($user) {
                                $q->where('user_id', $user->id);
                            })
                            ->where('status', 1)
                            ->whereJsonContains('meal_types', $type)
                            ->inRandomOrder()
                            ->first();

                        if ($favorite) {
                            $recipeToRecommend = $favorite;
                        } else {
                            // 2. If no favorite, pick a random active recipe for this meal type
                            $random = Recipe::where('status', 1)
                                ->whereJsonContains('meal_types', $type)
                                ->inRandomOrder()
                                ->first();
                            
                            // 3. Absolute Fallback
                            if (!$random) {
                                $random = Recipe::where('status', 1)->inRandomOrder()->first();
                            }

                            $recipeToRecommend = $random;
                        }

                        if ($recipeToRecommend) {
                            RecommendationSchedule::create([
                                'recipe_id' => $recipeToRecommend->id,
                                'meal_type' => $type,
                                'scheduled_for' => $today,
                                'user_id' => $user->id,
                            ]);
                        }
                    }
                }
            }
        });

        Log::info("Daily recommendations generated for $today.");
        $this->info('Done!');
    }
}
