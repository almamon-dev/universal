<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Helper
{
    public static function uploadFile($folderName, $file, $fileName = null): string
    {
        // Ensure folder exists
        $uploadPath = public_path('uploads/'.$folderName);
        if (! file_exists($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }
        // Generate file name if not provided
        $fileName = $fileName ?? time().'_'.Str::random(8).'.'.$file->getClientOriginalExtension();
        // Move file to public folder
        $file->move($uploadPath, $fileName);

        // Return relative path for URL usage
        return 'uploads/'.$folderName.'/'.$fileName;
    }

    /**
     * Save a base64 encoded image string to the disk
     */
    public static function saveBase64Image(string $folderName, string $base64Data, string $prefix = 'img'): ?string
    {
        try {
            // Check if it's a data URI and extract base64 data
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
                $data = substr($base64Data, strpos($base64Data, ',') + 1);
                $extension = strtolower($type[1]);
            } else {
                $data = $base64Data;
                $extension = 'png';
            }

            $decodedData = base64_decode($data);
            if (! $decodedData) {
                return null;
            }

            $fileName = $prefix.'_'.time().'_'.Str::random(8).'.'.$extension;
            $uploadPath = public_path('uploads/'.$folderName);

            if (! file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            file_put_contents($uploadPath.'/'.$fileName, $decodedData);

            return 'uploads/'.$folderName.'/'.$fileName;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Delete a file from public/uploads
     */
    public static function deleteFile(?string $filePath): bool
    {
        if (! $filePath) {
            return false;
        }
        $fullPath = public_path($filePath);
        // Only unlink if it's a file
        if (file_exists($fullPath) && is_file($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }

    /**
     * Generate a public URL for the uploaded file
     */
    public static function generateURL(?string $filePath): ?string
    {
        // Check if the path is empty or only whitespace
        if (empty($filePath) || trim($filePath) === '') {
            return null;
        }
        $fullPath = public_path($filePath);
        // Only return URL if file actually exists
        if (file_exists($fullPath)) {
            return asset($filePath);
        }

        return null;
    }

    /**
     * Generate public URLs for an array of file paths
     */
    public static function generateURLArray(array $filePaths): array
    {
        return array_map(fn ($path) => self::generateURL($path), $filePaths);
    }
}
