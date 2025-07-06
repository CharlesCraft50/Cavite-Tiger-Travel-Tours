<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait StoresImages
{
    public function storeGetImage(Request $request, string $id, string $folder): string
    {
        $file = $request->file($id);
        return $file->store($folder, 'public');
    }
}
