import { useState } from "react";
import TabList from "../utils/TabList";
import OptionChain from "./OptionChain";
import Positions from "./Positions";
import Contracts from "./Contracts";
import Header from "./Header";

const tabs: string[] = ["Option Chain", "Positions"];

interface TabPanelProps {
  selectedTab: string;
  selectedEquity: string;
  ltpOptions: Record<string, unknown>;
  equityOptions: Record<string, unknown>;
}

function TabPanel({
  selectedTab,
  selectedEquity,
  ltpOptions,
  equityOptions,
}: TabPanelProps) {
  switch (selectedTab) {
    case "Option Chain":
      return (
        <OptionChain
          selectedEquity={selectedEquity}
          ltpOptions={ltpOptions}
          equityOptions={equityOptions}
        />
      );
    case "Positions":
      return <Positions />;
    default:
      return null;
  }
}

export default function NewStrategy() {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
  const [selectedEquity, setSelectedEquity] = useState<string>("");
  const [ltpOptions, setLtpOptions] = useState<Record<string, unknown>>({});
  const [equityOptions, setEquityOptions] = useState<Record<string, unknown>>(
    {}
  );

  return (
    <div className="bg-gray-50 w-full h-full flex flex-col">
      <Header />
      <TabList
        tabs={tabs}
        onTabSelect={setSelectedTab}
        selectedTab={selectedTab}
      />
      <Contracts
        setLtpOptions={setLtpOptions}
        setEquityOptions={setEquityOptions}
        selectedEquity={selectedEquity}
        setSelectedEquity={setSelectedEquity}
      />
      <TabPanel
        selectedTab={selectedTab}
        selectedEquity={selectedEquity}
        ltpOptions={ltpOptions}
        equityOptions={equityOptions}
      />
    </div>
  );
}
