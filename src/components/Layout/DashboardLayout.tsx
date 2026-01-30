import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAgentRoster } from "../../store/AgentRosterContext";
import { useAuth } from "../../store/AuthContext";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/agents", label: "Agents" },
  { to: "/brokerages", label: "Brokerages" },
  { to: "/offices", label: "Offices" },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { agents, getAgentPhotos } = useAgentRoster();
  const { user, logout } = useAuth();
  const firstAgent = Object.values(agents).find((a) => a.isActive);
  const loggedInUserPhoto = firstAgent
    ? getAgentPhotos(firstAgent.id).find((p) => p.type === "headshot")?.url
    : null;

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Full-width top bar: unified height, light gray line under */}
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-[#e8e8e8] bg-white px-4 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-gray-100 text-[#3e4543]"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="flex items-center min-w-0">
            <img src="/logo.png" alt="HomeServices of America" className="h-9 w-auto object-contain" />
          </Link>
        </div>
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {loggedInUserPhoto ? (
              <img
                src={loggedInUserPhoto}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-[#e8e8e8] flex items-center justify-center text-[#3e4543] text-sm font-medium" aria-hidden>
                {user?.name.split(" ").map(n => n[0]).join("") || "AJ"}
              </div>
            )}
            <span className="text-sm font-medium text-[#3e4543] hidden sm:inline">{user?.name || "Alex Johnson"}</span>
            <svg className="w-4 h-4 text-[#6b7270] hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[#e8e8e8] bg-white shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-[#e8e8e8]">
                <p className="text-sm font-medium text-[#3e4543]">{user?.name || "Alex Johnson"}</p>
                <p className="text-xs text-[#6b7270] mt-0.5">{user?.email || "alex.johnson@homeservices.com"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-[#3e4543] hover:bg-[#f8f8f8] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0 md:flex-row">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar – dark gray, fixed on desktop */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40
            md:top-16 md:h-[calc(100vh-4rem)]
            w-64 flex-shrink-0
            bg-[#2a2e2d] text-white
            transform transition-transform duration-200 ease-out
            md:transform-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="flex flex-col h-full pt-4 md:pt-6">
            <div className="flex items-center justify-end px-4 pb-4 md:hidden">
              <button
                type="button"
                className="p-2 rounded-md hover:bg-[#353a39] text-white"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-5 pb-5 space-y-1">
              {nav.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    block px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === to
                      ? "bg-[#832238] text-white"
                      : "text-gray-300 hover:bg-[#353a39] hover:text-white"}
                  `}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-6 py-10 md:px-10 md:py-12 md:ml-64 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
