<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;

class SystemSettingsController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Settings/System', [
            'settings' => [
                'mail_driver' => env('MAIL_MAILER', 'smtp'),
                'mail_host' => env('MAIL_HOST', ''),
                'mail_port' => env('MAIL_PORT', '587'),
                'mail_username' => env('MAIL_USERNAME', ''),
                'mail_password' => env('MAIL_PASSWORD', ''),
                'mail_encryption' => env('MAIL_ENCRYPTION', 'tls'),
                'mail_from_address' => env('MAIL_FROM_ADDRESS', ''),
                'mail_from_name' => env('MAIL_FROM_NAME', ''),
                'openai_api_key' => env('OPENAI_API_KEY', ''),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'mail_driver' => 'required|string',
            'mail_host' => 'required|string',
            'mail_port' => 'required|string',
            'mail_username' => 'nullable|string',
            'mail_password' => 'nullable|string',
            'mail_encryption' => 'nullable|string',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required|string',
            'openai_api_key' => 'nullable|string',
        ]);

        $envData = [
            'MAIL_MAILER' => $validated['mail_driver'],
            'MAIL_HOST' => $validated['mail_host'],
            'MAIL_PORT' => $validated['mail_port'],
            'MAIL_USERNAME' => $validated['mail_username'] ?? '',
            'MAIL_PASSWORD' => $validated['mail_password'] ?? '',
            'MAIL_ENCRYPTION' => $validated['mail_encryption'] ?? '',
            'MAIL_FROM_ADDRESS' => $validated['mail_from_address'],
            'MAIL_FROM_NAME' => $validated['mail_from_name'],
            'OPENAI_API_KEY' => $validated['openai_api_key'] ?? '',
        ];

        $this->updateEnv($envData);

        // Clear config cache to apply changes
        Artisan::call('config:clear');

        return back()->with('success', 'System settings updated successfully.');
    }

    protected function updateEnv(array $data)
    {
        $path = base_path('.env');

        if (!file_exists($path)) {
            return;
        }

        $content = file_get_contents($path);

        foreach ($data as $key => $value) {
            // Escape special characters in value for regex
            $escapedValue = str_replace('$', '\$', $value);
            
            // If value contains spaces or special chars, wrap in quotes
            if (preg_match('/\s/', $value) || preg_match('/[#&]/', $value)) {
                $value = '"' . $value . '"';
            }

            if (preg_match("/^{$key}=/m", $content)) {
                $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
            } else {
                $content .= "\n{$key}={$value}";
            }
        }

        file_put_contents($path, $content);
    }
}
