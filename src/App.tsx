import NewStrategy from "./components/NewStrategy";

export default function App() {
  return (
    <div className="grid grid-cols-5 gap-2 h-screen text-sm text-gray-900 overflow-hidden">
      <div className="col-span-2 border-r h-full overflow-hidden">
        <NewStrategy />
      </div>
      <div className="col-span-3 border-l"></div>
    </div>
  );
}
