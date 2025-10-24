import React from "react";

const TripRatesInfo: React.FC = () => {
  return (
    <div className="mt-6 mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🚐 CTTT Trip Rates Based on Distance (KM)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-blue-200 rounded-lg bg-white">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 text-left border-b">Distance (KM)</th>
              <th className="p-2 text-left border-b">Trip Cost</th>
              <th className="p-2 text-left border-b">Inclusions</th>
              <th className="p-2 text-left border-b">Maximum Hours</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["50 – 100 KM", "₱2,500 + Fuel + Toll (if applicable)", "–", "12 hours"],
              ["101 – 200 KM", "₱3,500 + Fuel + Toll (if applicable)", "–", "12 hours"],
              ["201 – 300 KM", "₱4,000 + Fuel + Toll (if applicable)", "–", "12 hours"],
              ["301 – 400 KM", "₱4,500 + Fuel + Toll (if applicable)", "–", "12 hours"],
              ["401 – 500 KM", "₱5,000 + Fuel + Toll (if applicable)", "–", "12 hours"],
              ["501 KM & above", "₱6,000/day + Fuel + Toll (if applicable)", "–", "12 hours/day"],
            ].map(([distance, cost, inclusions, hours], i) => (
              <tr key={i} className="odd:bg-white even:bg-blue-50">
                <td className="p-2 border-b">{distance}</td>
                <td className="p-2 border-b">{cost}</td>
                <td className="p-2 border-b">{inclusions}</td>
                <td className="p-2 border-b">{hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="font-semibold">⏱ Overtime Charges</p>
        <p>₱350/hour for trips exceeding 12 hours (Day Tour basis)</p>

        <p className="font-semibold mt-3">💎 Premium Vans</p>
        <p>Add ₱1,000 for every distance category listed above</p>

        <p className="font-semibold mt-3">⚠️ Notes</p>
        <p>Rates apply to regular vans only unless otherwise stated.</p>
        <p>All rates are subject to confirmation and availability.</p>
      </div>
    </div>
  );
};

export default TripRatesInfo;
