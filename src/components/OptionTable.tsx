import { useRef, useMemo, useEffect, useCallback } from "react";
import { useVirtualizer, elementScroll } from "@tanstack/react-virtual";
import type { VirtualizerOptions } from "@tanstack/react-virtual";

interface Option {
  call_delta: number | null;
  call_LTP: number | null;
  strike: number | null;
  put_LTP: number | null;
  put_delta: number | null;
}

interface OptionTableProps {
  optionChain: Option[];
}

const tableHeader = ["Delta", "Call LTP", "Strike", "Put LTP", "Delta"];

// Easing function for smooth scrolling
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export default function OptionTable({ optionChain }: OptionTableProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const scrollingRef = useRef<number>();

  // Custom scrollTo function using easing
  const scrollToFn: VirtualizerOptions<any, any>["scrollToFn"] = useCallback(
    (offset, canSmooth, instance) => {
      const duration = 1000; // Adjust the duration for slower/faster scrolling
      const start = parentRef.current?.scrollTop || 0;
      const startTime = (scrollingRef.current = Date.now());

      const run = () => {
        if (scrollingRef.current !== startTime) return;
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
        const interpolated = start + (offset - start) * progress;

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance);
          requestAnimationFrame(run);
        } else {
          elementScroll(interpolated, canSmooth, instance);
        }
      };

      requestAnimationFrame(run);
    },
    []
  );

  const rowVirtualizer = useVirtualizer({
    count: optionChain.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
    scrollToFn, // Use the custom smooth scrolling function
  });

  // Calculate the index where put_LTP first becomes greater than call_LTP
  const highlightIndex = useMemo(() => {
    return optionChain.findIndex(
      (option) =>
        option.put_LTP && option.call_LTP && option.put_LTP > option.call_LTP
    );
  }, [optionChain]);

  // Auto-scroll to the highlighted index smoothly when it changes
  useEffect(() => {
    if (highlightIndex >= 0) {
      rowVirtualizer.scrollToIndex(highlightIndex + 5);
    }
  }, [highlightIndex, rowVirtualizer]);

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

            return (
              <div
                key={virtualRow.index}
                className={`flex border-b ${
                  virtualRow.index === highlightIndex && "bg-blue-50"
                }`}
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
                    virtualRow.index < highlightIndex && "bg-yellow-50"
                  }`}
                >
                  {optionRow.call_delta || "---"}
                </div>
                <div
                  className={`flex-1 p-2 text-center font-medium ${
                    virtualRow.index < highlightIndex && "bg-yellow-50"
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
                    virtualRow.index > highlightIndex && "bg-yellow-50"
                  }`}
                >
                  {optionRow.put_LTP || "---"}
                </div>
                <div
                  className={`flex-1 p-2 text-center ${
                    virtualRow.index > highlightIndex && "bg-yellow-50"
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
