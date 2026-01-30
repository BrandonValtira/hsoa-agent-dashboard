import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAgentRoster } from "../store/AgentRosterContext";
import { useDebounce } from "../hooks/useDebounce";
import { Card } from "../components/Card";

export function Dashboard() {
  const { agents, offices, brokerages, getOffice, getBrokerage } = useAgentRoster();
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerageFilter, setBrokerageFilter] = useState("");
  const [officeFilter, setOfficeFilter] = useState("");

  // Debounce search to avoid filtering on every keystroke
  const debouncedSearch = useDebounce(searchQuery, 200);

  const allAgents = useMemo(
    () => Object.values(agents).filter((a) => a.isActive),
    [agents]
  );

  const filteredAgents = useMemo(() => {
    let list = allAgents;
    if (brokerageFilter) list = list.filter((a) => a.brokerageId === brokerageFilter);
    if (officeFilter) list = list.filter((a) => a.officeId === officeFilter);
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((agent) => {
      const office = getOffice(agent.officeId);
      const brokerage = getBrokerage(agent.brokerageId);
      const name = `${agent.firstName} ${agent.lastName}`.toLowerCase();
      const email = (agent.email ?? "").toLowerCase();
      const officeName = (office?.name ?? "").toLowerCase();
      const brokerageName = (brokerage?.name ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || officeName.includes(q) || brokerageName.includes(q);
    });
  }, [allAgents, brokerageFilter, officeFilter, debouncedSearch, getOffice, getBrokerage]);

  const brokerageList = useMemo(
    () => Object.values(brokerages).sort((a, b) => a.name.localeCompare(b.name)),
    [brokerages]
  );
  const officeList = useMemo(() => {
    if (!brokerageFilter) {
      return Object.values(offices).sort((a, b) => a.name.localeCompare(b.name));
    }
    const agentOfficeIds = new Set(
      allAgents.filter((a) => a.brokerageId === brokerageFilter).map((a) => a.officeId)
    );
    const list = Object.values(offices).filter(
      (o) => o.brokerageId === brokerageFilter && agentOfficeIds.has(o.id)
    );
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [offices, brokerageFilter, allAgents]);

  // Virtualization for agent list
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredAgents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Estimated row height
    overscan: 10,
  });

  const hasFilters = debouncedSearch.trim() || brokerageFilter || officeFilter;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-[#3e4543]">Dashboard</h1>
        <p className="text-[#3e4543] mt-2 text-[15px]">Agent roster and organizational data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">{allAgents.length}</p>
          <p className="text-sm text-[#6b7270] mt-1">Active agents</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">{Object.keys(offices).length}</p>
          <p className="text-sm text-[#6b7270] mt-1">Offices</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">{Object.keys(brokerages).length}</p>
          <p className="text-sm text-[#6b7270] mt-1">Brokerages</p>
        </Card>
      </div>

      <Card title="Agents">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, office, or brokerage..."
              className="w-full rounded-lg border border-[#e8e8e8] px-4 py-3 pl-11 text-[#3e4543] placeholder:text-[#6b7270] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] text-base"
              aria-label="Search agents"
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
            <div className="relative">
              <select
                value={brokerageFilter}
                onChange={(e) => {
                  setBrokerageFilter(e.target.value);
                  setOfficeFilter("");
                }}
                className="appearance-none rounded-lg border border-[#e8e8e8] pl-4 pr-10 py-3 text-base text-[#3e4543] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] bg-white h-[50px] cursor-pointer"
                aria-label="Refine by brokerage"
              >
                <option value="">All brokerages</option>
                {brokerageList.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7270] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="relative">
              <select
                value={officeList.some((o) => o.id === officeFilter) ? officeFilter : ""}
                onChange={(e) => setOfficeFilter(e.target.value)}
                className="appearance-none rounded-lg border border-[#e8e8e8] pl-4 pr-10 py-3 text-base text-[#3e4543] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] bg-white h-[50px] cursor-pointer"
                aria-label="Refine by office"
              >
                <option value="">All offices{brokerageFilter ? " (this brokerage)" : ""}</option>
                {officeList.map((office) => (
                  <option key={office.id} value={office.id}>{office.name}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7270] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {hasFilters && (
            <p className="text-sm text-[#6b7270]">
              Showing {filteredAgents.length} of {allAgents.length} agents
            </p>
          )}

          {filteredAgents.length === 0 ? (
            <p className="py-8 text-center text-[#6b7270]">
              {hasFilters ? "No agents match your filters." : "No active agents."}
            </p>
          ) : (
            <div
              ref={parentRef}
              className="h-[400px] overflow-auto"
              style={{ contain: "strict" }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const agent = filteredAgents[virtualRow.index];
                  const office = getOffice(agent.officeId);
                  const brokerage = getBrokerage(agent.brokerageId);
                  return (
                    <div
                      key={virtualRow.key}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="py-4 border-b border-[#e8e8e8] last:border-b-0">
                        <Link
                          to={`/agents/${agent.id}`}
                          className="flex flex-wrap items-center gap-2 text-[#3e4543] hover:text-[#832238] font-medium transition-colors"
                        >
                          {agent.firstName} {agent.lastName}
                          {brokerage && (
                            <span className="text-[#6b7270] font-normal text-sm">— {brokerage.name}</span>
                          )}
                          {office && (
                            <span className="text-[#6b7270] font-normal text-sm">— {office.name}</span>
                          )}
                        </Link>
                        <p className="text-sm text-[#6b7270] mt-1">{agent.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
