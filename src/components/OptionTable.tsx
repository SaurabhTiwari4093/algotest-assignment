import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Option {
  call_LTP: number | null;
  call_delta: number | null;
  strike: number | null;
  put_LTP: number | null;
  put_delta: number | null;
}

interface OptionTableProps {
  optionChain: Option[];
}

const tableHeader = ["Delta", "Call LTP", "Strike", "Put LTP", "Delta"];

export default function OptionTable({ optionChain }: OptionTableProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: optionChain.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  // Calculate the index where put_close first becomes greater than call_close
  const highlightIndex = useMemo(() => {
    return optionChain.findIndex(
      (option) =>
        option.put_LTP && option.call_LTP && option.put_LTP > option.call_LTP
    );
  }, [optionChain]);

  return (
    <>
      <div className="flex border-b">
        {tableHeader.map((header) => (
          <div className="flex-1 p-2 text-center">{header}</div>
        ))}
      </div>
      <div
        ref={parentRef}
        className="flex-1 h-full w-full overflow-y-auto bg-white text-xs hidden-scrollbar"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const optionRow = optionChain[virtualRow.index];
            const isHighlightedRow = virtualRow.index >= highlightIndex;

            return (
              <div
                key={virtualRow.index}
                className="flex border-b"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  className={`flex-1 p-2 text-center ${
                    !isHighlightedRow && "bg-yellow-50"
                  }`}
                >
                  {optionRow.call_delta || "---"}
                </div>
                <div
                  className={`flex-1 p-2 text-center font-medium ${
                    !isHighlightedRow && "bg-yellow-50"
                  }`}
                >
                  {optionRow.call_LTP || "---"}
                </div>
                <div className="flex-1 p-2 flex items-center justify-center">
                  <div className="bg-gray-100 font-medium rounded py-1 px-2">
                    {optionRow.strike || "---"}
                  </div>
                </div>
                <div
                  className={`flex-1 p-2 text-center font-medium ${
                    isHighlightedRow && "bg-yellow-50"
                  }`}
                >
                  {optionRow.put_LTP || "---"}
                </div>
                <div
                  className={`flex-1 p-2 text-center ${
                    isHighlightedRow && "bg-yellow-50"
                  }`}
                >
                  {optionRow.put_delta || "---"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
