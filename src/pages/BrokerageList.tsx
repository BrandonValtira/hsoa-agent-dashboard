import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";

export function BrokerageList() {
  const { brokerages, agents, offices } = useAgentRoster();
  const [searchQuery, setSearchQuery] = useState("");

  const allBrokerages = useMemo(
    () => Object.values(brokerages).sort((a, b) => a.name.localeCompare(b.name)),
    [brokerages]
  );

  const filteredBrokerages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allBrokerages;
    return allBrokerages.filter((b) => b.name.toLowerCase().includes(q));
  }, [allBrokerages, searchQuery]);

  const getAgentCount = (brokerageId: string) =>
    Object.values(agents).filter((a) => a.isActive && a.brokerageId === brokerageId).length;

  const getOfficeCount = (brokerageId: string) =>
    Object.values(offices).filter((o) => o.brokerageId === brokerageId).length;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-[#3e4543]">Brokerages</h1>
        <p className="text-[#3e4543] mt-2 text-[15px]">View and manage brokerage companies</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brokerages..."
            className="w-full rounded-lg border border-[#e8e8e8] px-4 py-3 pl-11 text-[#3e4543] placeholder:text-[#6b7270] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] text-base"
            aria-label="Search brokerages"
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

        {searchQuery.trim() && (
          <p className="text-sm text-[#6b7270]">
            Showing {filteredBrokerages.length} of {allBrokerages.length} brokerages
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBrokerages.length === 0 ? (
          <p className="col-span-full py-8 text-center text-[#6b7270]">
            {searchQuery.trim() ? "No brokerages match your search." : "No brokerages found."}
          </p>
        ) : (
          filteredBrokerages.map((brokerage) => {
            const agentCount = getAgentCount(brokerage.id);
            const officeCount = getOfficeCount(brokerage.id);
            return (
              <Link
                key={brokerage.id}
                to={`/brokerages/${brokerage.id}`}
                className="block rounded-xl border border-[#e8e8e8] bg-white p-6 hover:border-[#832238]/30 transition-all"
              >
                <p className="font-semibold text-[#3e4543] leading-tight">
                  {brokerage.name}
                </p>
                <div className="flex gap-4 mt-3 text-sm text-[#6b7270]">
                  <span>{officeCount} {officeCount === 1 ? "office" : "offices"}</span>
                  <span>{agentCount} {agentCount === 1 ? "agent" : "agents"}</span>
                </div>
                {brokerage.website && (
                  <p className="text-sm text-[#6b7270] mt-2 truncate">{brokerage.website.replace(/^https?:\/\//, "")}</p>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
