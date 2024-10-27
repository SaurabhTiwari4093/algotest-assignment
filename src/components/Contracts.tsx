import { useState, useEffect } from "react";
import { fetchApi } from "../utils/fetchApi";
import EquitySelect from "./EquitySelect";
import FutureSelect from "./FutureSelect";

interface ContractsData {
  [key: string]: {
    FUT?: Record<string, unknown>;
    OPT?: Record<string, unknown>;
  };
}

interface Equities {
  indices: string[];
  stocks: string[];
}

interface OptionChainLTP {
  cash: { close: number | string };
  futures: Record<string, { close: number }>;
  options: Record<string, unknown>;
  vix: { close: number | string };
}

interface SelectedEquityData {
  FUT?: Record<string, unknown>;
  OPT?: Record<string, unknown>;
}

export default function Contracts() {
  const [contracts, setContracts] = useState<ContractsData>({});
  const [selectedEquity, setSelectedEquity] = useState<string>("");
  const [selectedEquityData, setSelectedEquityData] =
    useState<SelectedEquityData>({
      FUT: {},
      OPT: {},
    });
  const [optionChainLTP, setOptionChainLTP] = useState<OptionChainLTP>({
    cash: { close: "---" },
    vix: { close: "---" },
    futures: {},
    options: {},
  });
  const [equities, setEquities] = useState<Equities>({
    indices: [],
    stocks: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result: ContractsData = await fetchApi("/api/contracts");
      console.log("Contract data is ", result);
      setContracts(result);

      const tempEquities = Object.keys(result);
      setSelectedEquity(tempEquities[0] || ""); // Add a fallback for safety
      const indices = tempEquities.filter((key) => !key.startsWith("NSE_"));
      const stocks = tempEquities.filter((key) => key.startsWith("NSE_"));

      setEquities({ indices, stocks });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (contracts[selectedEquity]) {
        setSelectedEquityData({
          FUT: contracts[selectedEquity].FUT,
          OPT: contracts[selectedEquity].OPT,
        });
        const result: OptionChainLTP = await fetchApi(
          `/api/option-chain-with-ltp?underlying=${selectedEquity}`
        );
        console.log("Option chain result is ", result);
        setOptionChainLTP({
          cash: result.cash,
          vix: result.vix,
          futures: result.futures,
          options: result.options,
        });
      }
    };

    if (selectedEquity) {
      fetchData();
    }
  }, [selectedEquity]);

  return (
    <div className="border-b grid grid-cols-9">
      <div className="col-span-4 border-r">
        <EquitySelect
          equities={equities}
          selectedEquity={selectedEquity}
          setSelectedEquity={setSelectedEquity}
          close={optionChainLTP.cash.close}
        />
      </div>
      <div className="col-span-3 border-r">
        <FutureSelect
          equityFutures={selectedEquityData.FUT || {}}
          ltpFutures={optionChainLTP.futures}
        />
      </div>
      <div className="col-span-2 p-2">
        <div>India VIX</div>
        <div className="font-semibold">{optionChainLTP.vix.close}</div>
      </div>
    </div>
  );
}
