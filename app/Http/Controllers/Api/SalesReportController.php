<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesReport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class SalesReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'report_data' => 'required|array',
            'date_range' => 'required|array',
            'generated_at' => 'required|date',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $report = SalesReport::create([
            'report_data' => $request->report_data,
            'date_range' => $request->date_range,
            'generated_at' => $request->generated_at,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Sales report saved successfully',
            'report_id' => $report->id,
        ]);
    }

    public function generatePDF(Request $request)
    {
        $request->validate([
            'report' => 'required|array',
        ]);

        $report = $request->report;

        $pdf = PDF::loadView('pdf.sales-report', [
            'report' => $report,
            'generatedAt' => now()->format('Y-m-d H:i:s'),
        ]);

        $pdf->setOptions([
            'defaultFont' => 'DejaVu Sans',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
        ]);

        return $pdf->download('sales-report.pdf');
    }
}
