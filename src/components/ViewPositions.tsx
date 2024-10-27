export default function ViewPositions() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-6 h-3 inline-block">
        <input
          disabled
          id="switch-component"
          type="checkbox"
          className="peer appearance-none absolute top-0 left-0 w-6 h-3 bg-gray-300 rounded-full"
        />
        <label
          htmlFor="switch-component"
          className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full"
        />
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap mb-0.5">
        View positions
      </span>
    </div>
  );
}
