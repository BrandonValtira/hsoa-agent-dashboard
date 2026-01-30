import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";
import { Card } from "../components/Card";

export function BrokerageProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brokerages, offices, agents, getAgentPhotos } = useAgentRoster();

  const brokerage = id ? brokerages[id] : undefined;

  const brokerageOffices = useMemo(() => {
    if (!brokerage) return [];
    return Object.values(offices)
      .filter((o) => o.brokerageId === brokerage.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [offices, brokerage]);

  const brokerageAgents = useMemo(() => {
    if (!brokerage) return [];
    return Object.values(agents)
      .filter((a) => a.isActive && a.brokerageId === brokerage.id)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [agents, brokerage]);

  if (!brokerage) {
    return (
      <div className="space-y-6">
        <p className="text-[#3e4543]">Brokerage not found.</p>
        <button
          type="button"
          onClick={() => navigate("/brokerages")}
          className="text-[#3e4543] hover:text-[#832238] transition-colors"
        >
          Back to brokerages
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl">
      <div>
        <button
          type="button"
          onClick={() => navigate("/brokerages")}
          className="text-sm text-[#6b7270] hover:text-[#832238] mb-3 transition-colors"
        >
          ← Brokerages
        </button>
        <h1 className="text-2xl font-bold text-[#3e4543]">{brokerage.name}</h1>
        {brokerage.website && (
          <a
            href={brokerage.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#832238] hover:underline mt-2 inline-block"
          >
            {brokerage.website.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">{brokerageOffices.length}</p>
          <p className="text-sm text-[#6b7270] mt-1">Offices</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">{brokerageAgents.length}</p>
          <p className="text-sm text-[#6b7270] mt-1">Active agents</p>
        </Card>
      </div>

      <Card title="Offices">
        {brokerageOffices.length === 0 ? (
          <p className="text-[#6b7270] text-sm">No offices found for this brokerage.</p>
        ) : (
          <ul className="divide-y divide-[#e8e8e8]">
            {brokerageOffices.map((office) => {
              const officeAgentCount = brokerageAgents.filter((a) => a.officeId === office.id).length;
              return (
                <li key={office.id} className="py-4 first:pt-0 last:pb-0">
                  <Link
                    to={`/offices/${office.id}`}
                    className="font-medium text-[#3e4543] hover:text-[#832238] transition-colors"
                  >
                    {office.name}
                  </Link>
                  <p className="text-sm text-[#6b7270] mt-1">
                    {office.city}, {office.state} · {officeAgentCount} {officeAgentCount === 1 ? "agent" : "agents"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title="Agents">
        {brokerageAgents.length === 0 ? (
          <p className="text-[#6b7270] text-sm">No agents found for this brokerage.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {brokerageAgents.map((agent) => {
              const headshot = getAgentPhotos(agent.id).find((p) => p.type === "headshot");
              const office = offices[agent.officeId];
              return (
                <Link
                  key={agent.id}
                  to={`/agents/${agent.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e8e8] hover:border-[#832238]/30 transition-all"
                >
                  {headshot ? (
                    <img
                      src={headshot.url}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#e8e8e8] flex items-center justify-center text-[#3e4543] text-sm font-semibold flex-shrink-0">
                      {agent.firstName[0]}{agent.lastName[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#3e4543] truncate">
                      {agent.firstName} {agent.lastName}
                    </p>
                    {office && (
                      <p className="text-sm text-[#6b7270] truncate">{office.name}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
