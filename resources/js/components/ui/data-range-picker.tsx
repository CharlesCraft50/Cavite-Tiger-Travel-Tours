import { Calendar } from 'lucide-react';
import React from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DateRangePicker = {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (dates: [Date | null, Date | null]) => void;
    disabled?: boolean;
}

export default function DateRangePicker({ startDate, endDate, onChange, disabled }: DateRangePicker) {
  return (
    <div className="flex flex-row items-center w-full">
      <div className="border px-2 py-3 flex-shrink-0 rounded-l">
        <Calendar className="w-4 h-4 text-gray-700" />
      </div>
      <div className="flex-1 min-w-0">
        <DatePicker 
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          minDate={new Date()}
          placeholderText="Select your expiry date"
          className="w-full p-2 border rounded-r disabled:bg-gray-600/40 disabled:text-gray-600"
          wrapperClassName="w-full"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
