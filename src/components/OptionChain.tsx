import { useState, useEffect, useMemo } from "react";
import Expiry from "./Expiry";
import OptionTable from "./OptionTable";

interface OptionChainProps {
  selectedEquity: string;
  ltpOptions: Record<string, any>;
  equityOptions: Record<string, any>;
}

export default function OptionChain({
  selectedEquity,
  ltpOptions,
  equityOptions,
}: OptionChainProps) {
  const expiries = useMemo(
    () => Object.keys(equityOptions).sort(),
    [equityOptions]
  );

  const [selectedExpiry, setSelectedExpiry] = useState<string>("");

  useEffect(() => {
    if (expiries.length > 0) {
      setSelectedExpiry(expiries[0]);
    }
  }, [expiries]);

  const selectedOptionChain = useMemo(() => {
    if (selectedExpiry === "") return [];

    const equityData = equityOptions[selectedExpiry] || [];
    const ltpData = ltpOptions[selectedExpiry] || {
      strike: [],
      call_delta: [],
      put_delta: [],
      call_close: [],
      put_close: [],
    };

    // Create a Map for quick lookup of LTP data by strike
    const ltpDataMap = new Map<number, any>();
    ltpData.strike.forEach((strike: number, index: number) => {
      ltpDataMap.set(strike, {
        call_delta: ltpData.call_delta[index]?.toFixed(2) || null,
        put_delta: ltpData.put_delta[index]?.toFixed(2) || null,
        call_LTP: ltpData.call_close[index] || null,
        put_LTP: ltpData.put_close[index] || null,
      });
    });

    // Use a Set to track unique strikes and filter duplicates in equityData
    const uniqueStrikes = new Set<number>();
    const filteredEquityData = equityData.filter((equityItem) => {
      if (!uniqueStrikes.has(equityItem.strike)) {
        uniqueStrikes.add(equityItem.strike);
        return true;
      }
      return false;
    });

    // Merge equityData with LTP data using the Map
    const mergedData = filteredEquityData.map((equityItem) => {
      const ltpInfo = ltpDataMap.get(equityItem.strike) || {};
      return {
        token: equityItem.token,
        strike: equityItem.strike,
        call_delta: ltpInfo.call_delta || null,
        put_delta: ltpInfo.put_delta || null,
        call_LTP: ltpInfo.call_LTP || null,
        put_LTP: ltpInfo.put_LTP || null,
      };
    });

    // Sort the merged data by strike in ascending order
    mergedData.sort((a, b) => a.strike - b.strike);

    return mergedData;
  }, [selectedExpiry, selectedEquity, equityOptions, ltpOptions]);

  return (
    <>
      <Expiry
        expiries={expiries}
        setSelectedExpiry={setSelectedExpiry}
        selectedExpiry={selectedExpiry}
      />
      <OptionTable optionChain={selectedOptionChain} />
    </>
  );
}
