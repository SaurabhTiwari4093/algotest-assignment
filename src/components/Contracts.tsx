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
  vix: { close: number | string };
}

interface SelectedEquityData {
  FUT?: Record<string, unknown>;
}

interface ContractsProps {
  setLtpOptions: any;
  setEquityOptions: any;
  selectedEquity: string;
  setSelectedEquity: (equity: string) => void;
}

export default function Contracts({
  setLtpOptions,
  setEquityOptions,
  selectedEquity,
  setSelectedEquity,
}: ContractsProps) {
  const [contracts, setContracts] = useState<ContractsData>({});
  const [selectedEquityData, setSelectedEquityData] =
    useState<SelectedEquityData>({
      FUT: {},
    });
  const [optionChainLTP, setOptionChainLTP] = useState<OptionChainLTP>({
    cash: { close: "---" },
    vix: { close: "---" },
    futures: {},
  });
  const [equities, setEquities] = useState<Equities>({
    indices: [],
    stocks: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchApi("/api/contracts");
      setContracts(result);

      const tempEquities = Object.keys(result);
      setSelectedEquity(tempEquities[0] || "");
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
        });
        setEquityOptions(contracts[selectedEquity].OPT);
        const result = await fetchApi(
          `/api/option-chain-with-ltp?underlying=${selectedEquity}`
        );
        setOptionChainLTP({
          cash: result.cash,
          vix: result.vix,
          futures: result.futures,
        });
        setLtpOptions(result.options);
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
