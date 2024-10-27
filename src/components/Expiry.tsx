import LeftArrow from "../assets/icons/LeftArrow.svg";
import RightArrow from "../assets/icons/RightArrow.svg";
import { formatDate } from "../utils/formatDate";
import { useRef } from "react";
import Setting from "./Setting";
import ViewPositions from "./ViewPositions";

interface ExpiryProps {
  expiries: string[];
  selectedExpiry: string;
  setSelectedExpiry: any;
}

export default function Expiry({
  expiries,
  selectedExpiry,
  setSelectedExpiry,
}: ExpiryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="p-2 border-b flex items-center gap-2">
      <button onClick={scrollLeft} className="text-gray-600">
        <img src={LeftArrow} alt="Scroll Left" width={15} height={15} />
      </button>
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 flex-1 overflow-hidden"
      >
        {expiries.map((date) => (
          <button
            key={date}
            className={`whitespace-nowrap rounded p-1 ${
              date === selectedExpiry &&
              "bg-blue-50 text-blue-900 font-semibold"
            }`}
            onClick={() => setSelectedExpiry(date)}
          >
            {formatDate(date, false)}
          </button>
        ))}
      </div>
      <button onClick={scrollRight} className="text-gray-600">
        <img src={RightArrow} alt="Scroll Right" width={15} height={15} />
      </button>
      <ViewPositions />
      <Setting />
    </div>
  );
}
