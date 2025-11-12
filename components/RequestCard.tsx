import { CalendarDays, BedDouble, Bath } from "lucide-react";

interface RequestCardProps {
  area: string;
  dateRange: string;
  price: string;
  beds: number;
  baths: number;
  onView: () => void;
}

export default function RequestCard({
  area,
  dateRange,
  price,
  beds,
  baths,
  onView,
}: RequestCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between transition hover:shadow-md hover:-translate-y-1 duration-200">
      {/* Top Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#0B0B2C]">{area}</h3>
        <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
          <CalendarDays className="w-4 h-4" />
          <span>{dateRange}</span>
        </div>

        <div className="mt-4">
          <p className="text-gray-500 text-sm">Min</p>
          <p className="text-xl font-bold text-[#0B0B2C]">{price}</p>
        </div>

        <div className="flex items-center gap-3 mt-3 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4 text-gray-500" />
            <span>{beds} Beds</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-500" />
            <span>{baths} Bath</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onView}
        className="mt-6 w-full py-2.5 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-600 font-medium text-sm rounded-2xl transition-all"
      >
        View Details
      </button>
    </div>
  );
}
