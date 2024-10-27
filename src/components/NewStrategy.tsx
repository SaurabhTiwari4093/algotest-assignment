import { useState } from "react";
import TabList from "../utils/TabList";
import OptionChain from "./OptionChain";
import Positions from "./Positions";
import Contracts from "./Contracts";
import Header from "./Header";

const tabs: string[] = ["Option Chain", "Positions"];

interface TabPanelProps {
  selectedTab: string;
}

function TabPanel({ selectedTab }: TabPanelProps) {
  switch (selectedTab) {
    case "Option Chain":
      return <OptionChain />;
    case "Positions":
      return <Positions />;
    default:
      return null;
  }
}

export default function NewStrategy() {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);

  return (
    <div className="bg-gray-50 w-full h-full flex flex-col">
      <Header />
      <TabList
        tabs={tabs}
        onTabSelect={setSelectedTab}
        selectedTab={selectedTab}
      />
      <Contracts />
      <TabPanel selectedTab={selectedTab} />
    </div>
  );
}
