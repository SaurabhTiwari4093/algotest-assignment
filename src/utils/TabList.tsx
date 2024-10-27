type TabListProps = {
  tabs: string[];
  onTabSelect: (tab: string) => void;
  selectedTab: string;
};

export default function TabList({
  tabs,
  onTabSelect,
  selectedTab,
}: TabListProps) {
  return (
    <div className="flex w-full">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`p-2 flex-1 text-center ${
            selectedTab === tab
              ? "border-b-2 border-blue-500 font-semibold"
              : "cursor-pointer border-b"
          }`}
          onClick={() => onTabSelect(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}
