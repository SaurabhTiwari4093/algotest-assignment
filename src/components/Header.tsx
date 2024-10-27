import DoubleRight from "../assets/icons/DoubleRight.svg";
import More from "../assets/icons/More.svg";

export default function Header() {
  return (
    <div className="border-b p-2 flex justify-between items-center">
      <div className="flex-1 flex items-center">
        <img src={DoubleRight} alt="Strategies" width={20} height={20} />
        <span className="text-blue-700 text-xs font-semibold">Strategies</span>
      </div>
      <div className="flex-1 text-center">New strategy</div>
      <div className="flex-1 flex justify-end">
        <img src={More} alt="More Actions" width={20} height={20} />
      </div>
    </div>
  );
}
