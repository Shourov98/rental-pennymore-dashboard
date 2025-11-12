import { useState } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate 50 years dynamically (from 1980 to 2030)
const years = Array.from({ length: 56 }, (_, i) => 1980 + i);

export default function ReportDateSelector({
  defaultMonth = "",
  defaultYear = "",
  onChange,
}: {
  defaultMonth?: string;
  defaultYear?: string;
  onChange?: (month: string, year: string) => void;
}) {
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
    onChange?.(value, selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedYear(value);
    onChange?.(selectedMonth, value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Month Dropdown */}
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2"
      >
        <option value="">Select Month</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Year Dropdown */}
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2"
      >
        <option value="">Select Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
