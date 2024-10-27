import { useState, useEffect, useRef, useMemo } from "react";
import DownArrow from "../assets/icons/DownArrow.svg";
import { formatDate, formatDateFut } from "../utils/formatDate";

interface FutureSelectProps {
  equityFutures: Record<string, unknown>;
  ltpFutures: Record<string, { close: number }>;
}

export default function FutureSelect({
  equityFutures,
  ltpFutures,
}: FutureSelectProps) {
  const [show, setShow] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const futureOptions = useMemo(
    () => Object.keys(equityFutures).sort(),
    [equityFutures]
  );
  const [selectedFuture, setSelectedFuture] = useState<string>(
    futureOptions[0]
  );

  const handleDropdown = () => {
    setShow((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (futureOptions) {
      setSelectedFuture(futureOptions[0]);
    }
  }, [futureOptions]);

  const handleFutureSelect = (item: string) => {
    setSelectedFuture(item);
    handleDropdown();
  };

  return (
    <div className="relative p-2" ref={dropdownRef}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={handleDropdown}
      >
        <div>
          <div>{formatDateFut(selectedFuture)}</div>
          <div className="font-semibold">
            {ltpFutures[`${selectedFuture}`]?.close || "---"}
          </div>
        </div>
        <img src={DownArrow} alt="Dropdown" width={15} height={15} />
      </div>
      {show && (
        <div className="absolute top-[3.25rem] -left-5 -right-5 bg-white shadow rounded z-10 border max-h-96 overflow-auto hidden-scrollbar text-xs">
          <div className="flex bg-gray-100 border-b text-gray-600">
            <span className="p-2 flex-1 text-left">Expiry</span>
            <span className="p-2 flex-1 text-right">LTP</span>
          </div>
          {futureOptions.map((item, index) => (
            <div
              className={`flex hover:bg-gray-50 cursor-pointer ${
                index !== futureOptions.length - 1 && "border-b"
              }`}
              onClick={() => handleFutureSelect(item)}
            >
              <span className="p-2 flex-1 text-nowrap text-left">
                {formatDate(item)}
              </span>
              <span className="p-2 flex-1 text-right">
                {ltpFutures[`${item}`]?.close || "---"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
