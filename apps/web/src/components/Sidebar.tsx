import { useState } from "react";

function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="w-full shrink-0 border-b border-black/5 bg-[#F5F5EE] lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-3 lg:p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
            ✦
          </div>

          <span className="text-lg font-semibold">TraceForge</span>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-gray-500 hover:bg-white lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`px-3 pb-3 lg:block lg:px-4 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <div className="space-y-1">
          <button className="w-full rounded-xl bg-white px-3 py-2.5 text-left text-sm font-medium shadow-sm">
            Traces
          </button>

          {/* <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-white">
            Evaluations
          </button>

          <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-white">
            Projects
          </button> */}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
