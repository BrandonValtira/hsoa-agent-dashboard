import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";

export function AgentList() {
  const { agents, offices, brokerages, getOffice, getBrokerage, getAgentPhotos } = useAgentRoster();
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerageFilter, setBrokerageFilter] = useState<string>("");
  const [officeFilter, setOfficeFilter] = useState<string>("");

  const allAgents = useMemo(
    () => Object.values(agents).filter((a) => a.isActive),
    [agents]
  );

  const filteredAgents = useMemo(() => {
    let list = allAgents;
    if (brokerageFilter) list = list.filter((a) => a.brokerageId === brokerageFilter);
    if (officeFilter) list = list.filter((a) => a.officeId === officeFilter);
    const q = searchQuery.trim().toLowerCase();
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
  }, [allAgents, brokerageFilter, officeFilter, searchQuery, getOffice, getBrokerage]);

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

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-[#3e4543]">Agents</h1>
        <p className="text-[#3e4543] mt-2 text-[15px]">Select an agent to edit profile, photos, bio, and metrics</p>
      </div>

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
          <select
            value={brokerageFilter}
            onChange={(e) => {
              setBrokerageFilter(e.target.value);
              setOfficeFilter("");
            }}
            className="rounded-lg border border-[#e8e8e8] px-4 py-3 max-w-[180px] text-base text-[#3e4543] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] bg-white truncate h-[50px]"
            aria-label="Refine by brokerage"
            title={brokerageFilter ? brokerageList.find((b) => b.id === brokerageFilter)?.name : "All brokerages"}
          >
            <option value="">All brokerages</option>
            {brokerageList.map((b) => (
              <option key={b.id} value={b.id} title={b.name}>{b.name.length > 28 ? b.name.slice(0, 25) + "…" : b.name}</option>
            ))}
          </select>
          <select
            value={officeList.some((o) => o.id === officeFilter) ? officeFilter : ""}
            onChange={(e) => setOfficeFilter(e.target.value)}
            className="rounded-lg border border-[#e8e8e8] px-4 py-3 max-w-[180px] text-base text-[#3e4543] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] bg-white truncate h-[50px]"
            aria-label="Refine by office"
            title={officeFilter ? officeList.find((o) => o.id === officeFilter)?.name : "All offices"}
          >
            <option value="">All offices{brokerageFilter ? " (this brokerage)" : ""}</option>
            {officeList.map((office) => (
              <option key={office.id} value={office.id} title={office.name}>{office.name.length > 28 ? office.name.slice(0, 25) + "…" : office.name}</option>
            ))}
          </select>
        </div>
      </div>

      {(searchQuery.trim() || brokerageFilter || officeFilter) && (
        <p className="text-sm text-[#6b7270]">
          Showing {filteredAgents.length} of {allAgents.length} agents
        </p>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.length === 0 ? (
          <p className="col-span-full py-8 text-center text-[#6b7270]">
            {searchQuery.trim() || brokerageFilter || officeFilter ? "No agents match your filters." : "No active agents."}
          </p>
        ) : (
          filteredAgents.map((agent) => {
            const office = getOffice(agent.officeId);
            const brokerage = getBrokerage(agent.brokerageId);
            const headshot = getAgentPhotos(agent.id).find((p) => p.type === "headshot");
            return (
              <Link
                key={agent.id}
                to={`/agents/${agent.id}`}
                className="block rounded-xl border border-[#e8e8e8] bg-white p-6 hover:border-[#832238]/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {headshot ? (
                    <img
                      src={headshot.url}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-[#e8e8e8] flex items-center justify-center text-[#3e4543] font-semibold flex-shrink-0">
                      {agent.firstName[0]}
                      {agent.lastName[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#3e4543]">
                      {agent.firstName} {agent.lastName}
                    </p>
                    {agent.title && (
                      <p className="text-sm text-[#6b7270] mt-0.5">{agent.title}</p>
                    )}
                    {brokerage && (
                      <p className="text-sm text-[#6b7270] mt-1">{brokerage.name}</p>
                    )}
                    {office && (
                      <p className="text-sm text-[#6b7270] mt-0.5">{office.name}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
