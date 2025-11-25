<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sales Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .section { margin-bottom: 20px; }
        .section-title { background-color: #f8f9fa; padding: 10px; font-weight: bold; border-left: 4px solid #007bff; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0; }
        .stat-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f8f9fa; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .currency { font-family: DejaVu Sans, Arial, sans-serif; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sales Report</h1>
        <p>Period: {{ $report['period'] }}</p>
        <p>Generated: {{ $generatedAt }}</p>
    </div>

    <div class="section">
        <div class="section-title">Key Metrics</div>
        <div class="stats-grid">
            <div class="stat-item">
                <strong>Total Revenue:</strong><br>
                <span class="currency">&#8369;{{ number_format($report['totalRevenue'], 2) }}</span>
            </div>
            <div class="stat-item">
                <strong>Total Bookings:</strong><br>
                {{ $report['totalBookings'] }}
            </div>
            <div class="stat-item">
                <strong>Custom Trips:</strong><br>
                {{ $report['totalCustomTrips'] }}
            </div>
            <div class="stat-item">
                <strong>Completed Trips:</strong><br>
                {{ $report['completedTrips'] }}
            </div>
            <div class="stat-item">
                <strong>Pending Payments:</strong><br>
                {{ $report['pendingPayments'] }}
            </div>
            <div class="stat-item">
                <strong>Avg Revenue/Booking:</strong><br>
                <span class="currency">&#8369;{{ number_format($report['averageRevenuePerBooking'], 2) }}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Revenue by Month</div>
        <table class="table">
            <thead>
                <tr>
                    <th>Month</th>
                    <th class="text-right">Revenue</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report['revenueByMonth'] as $item)
                <tr>
                    <td>{{ $item['month'] }}</td>
                    <td class="text-right currency">&#8369;{{ number_format($item['revenue'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Booking Status Breakdown</div>
        <table class="table">
            <thead>
                <tr>
                    <th>Status</th>
                    <th class="text-right">Count</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report['bookingStatusBreakdown'] as $status => $count)
                <tr>
                    <td>{{ ucfirst(str_replace('_', ' ', $status)) }}</td>
                    <td class="text-right">{{ $count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Top Revenue Packages</div>
        <table class="table">
            <thead>
                <tr>
                    <th>Package</th>
                    <th class="text-right">Revenue</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report['topRevenuePackages'] as $package)
                <tr>
                    <td>{{ $package['name'] }}</td>
                    <td class="text-right currency">&#8369;{{ number_format($package['revenue'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <p><strong>Most Popular Package:</strong> {{ $report['mostPopularPackage'] }}</p>
    </div>
</body>
</html>