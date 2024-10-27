import { useState, useEffect, useRef } from "react";
import DownArrow from "../assets/icons/DownArrow.svg";

const formatEquityName = (name: string): string => {
  // Check if the equity name starts with 'NSE_' and format accordingly
  if (name.startsWith("NSE_")) {
    name = name.replace("NSE_", "");
    return (
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() + " (NSE)"
    );
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

interface Equities {
  indices: string[];
  stocks: string[];
}

interface EquitySelectProps {
  equities: Equities;
  selectedEquity: string;
  setSelectedEquity: (equity: string) => void;
  close: number | string;
}

export default function EquitySelect({
  equities,
  selectedEquity,
  setSelectedEquity,
  close,
}: EquitySelectProps) {
  const [show, setShow] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleContractSelect = (item: string) => {
    setSelectedEquity(item);
    handleDropdown();
  };

  return (
    <div className="relative p-2" ref={dropdownRef}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={handleDropdown}
      >
        <div>
          <div>{formatEquityName(selectedEquity)}</div>
          <div className="font-semibold">{close}</div>
        </div>
        <img src={DownArrow} alt="Dropdown" width={15} height={15} />
      </div>
      {show && (
        <div className="absolute top-[3.25rem] left-0 bg-white shadow rounded w-full z-10 border max-h-96 overflow-auto hidden-scrollbar text-xs">
          <div className="text-gray-600 p-2">INDEX</div>
          {equities?.indices.map((index) => (
            <div
              key={index}
              className="hover:bg-blue-50 cursor-pointer flex justify-between items-center p-2"
              onClick={() => handleContractSelect(index)}
            >
              <span>{formatEquityName(index)}</span>
              <span>---</span>
            </div>
          ))}
          <div className="text-gray-600 p-2">STOCKS</div>
          {equities?.stocks.map((stock) => (
            <div
              key={stock}
              className="hover:bg-blue-50 cursor-pointer flex justify-between items-center p-2"
              onClick={() => handleContractSelect(stock)}
            >
              <span>{formatEquityName(stock)}</span>
              <span>---</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
