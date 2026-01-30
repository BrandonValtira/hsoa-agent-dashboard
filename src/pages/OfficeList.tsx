import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";
import { useDebounce } from "../hooks/useDebounce";

export function OfficeList() {
  const { offices, brokerages, agents, getBrokerage } = useAgentRoster();
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerageFilter, setBrokerageFilter] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 200);

  const allOffices = useMemo(
    () => Object.values(offices).sort((a, b) => a.name.localeCompare(b.name)),
    [offices]
  );

  const filteredOffices = useMemo(() => {
    let list = allOffices;
    if (brokerageFilter) {
      list = list.filter((o) => o.brokerageId === brokerageFilter);
    }
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((office) => {
      const brokerage = getBrokerage(office.brokerageId);
      const officeName = office.name.toLowerCase();
      const city = (office.city ?? "").toLowerCase();
      const brokerageName = (brokerage?.name ?? "").toLowerCase();
      return officeName.includes(q) || city.includes(q) || brokerageName.includes(q);
    });
  }, [allOffices, brokerageFilter, debouncedSearch, getBrokerage]);

  const brokerageList = useMemo(
    () => Object.values(brokerages).sort((a, b) => a.name.localeCompare(b.name)),
    [brokerages]
  );

  const getAgentCount = (officeId: string) =>
    Object.values(agents).filter((a) => a.isActive && a.officeId === officeId).length;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-[#3e4543]">Offices</h1>
        <p className="text-[#3e4543] mt-2 text-[15px]">View and manage office locations</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by office name, city, or brokerage..."
            className="w-full rounded-lg border border-[#e8e8e8] px-4 py-3 pl-11 text-[#3e4543] placeholder:text-[#6b7270] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] text-base"
            aria-label="Search offices"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7270]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative w-[220px] min-w-[220px] flex-shrink-0">
            <select
              value={brokerageFilter}
              onChange={(e) => setBrokerageFilter(e.target.value)}
              className="appearance-none w-full rounded-lg border border-[#e8e8e8] pl-4 pr-10 py-3 text-base text-[#3e4543] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] bg-white h-[50px] cursor-pointer truncate"
              aria-label="Filter by brokerage"
            >
              <option value="">All brokerages</option>
              {brokerageList.map((b) => (
                <option key={b.id} value={b.id} title={b.name}>{b.name.length > 32 ? b.name.slice(0, 29) + "…" : b.name}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7270] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {(debouncedSearch.trim() || brokerageFilter) && (
          <p className="text-sm text-[#6b7270]">
            Showing {filteredOffices.length} of {allOffices.length} offices
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOffices.length === 0 ? (
          <p className="col-span-full py-8 text-center text-[#6b7270]">
            {debouncedSearch.trim() || brokerageFilter ? "No offices match your filters." : "No offices found."}
          </p>
        ) : (
          filteredOffices.map((office) => {
            const brokerage = getBrokerage(office.brokerageId);
            const agentCount = getAgentCount(office.id);
            return (
              <Link
                key={office.id}
                to={`/offices/${office.id}`}
                className="block rounded-xl border border-[#e8e8e8] bg-white p-6 hover:border-[#832238]/30 transition-all"
              >
                <p className="font-semibold text-[#3e4543]">{office.name}</p>
                {brokerage && (
                  <p className="text-sm text-[#6b7270] mt-1 truncate">{brokerage.name}</p>
                )}
                <p className="text-sm text-[#6b7270] mt-1">
                  {office.city}, {office.state}
                </p>
                <p className="text-sm text-[#6b7270] mt-2">
                  {agentCount} {agentCount === 1 ? "agent" : "agents"}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
