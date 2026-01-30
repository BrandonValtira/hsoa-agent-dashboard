import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";
import { Card } from "../components/Card";

export function OfficeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { offices, agents, getAgentPhotos, getBrokerage } = useAgentRoster();

  const office = id ? offices[id] : undefined;
  const brokerage = office ? getBrokerage(office.brokerageId) : undefined;

  const officeAgents = useMemo(() => {
    if (!office) return [];
    return Object.values(agents)
      .filter((a) => a.isActive && a.officeId === office.id)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [agents, office]);

  if (!office) {
    return (
      <div className="space-y-6">
        <p className="text-[#3e4543]">Office not found.</p>
        <button
          type="button"
          onClick={() => navigate("/offices")}
          className="text-[#3e4543] hover:text-[#832238] transition-colors"
        >
          Back to offices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl">
      <div>
        <button
          type="button"
          onClick={() => navigate("/offices")}
          className="text-sm text-[#6b7270] hover:text-[#832238] mb-3 transition-colors"
        >
          ← Offices
        </button>
        <h1 className="text-2xl font-bold text-[#3e4543]">{office.name}</h1>
        {brokerage && (
          <Link
            to={`/brokerages/${brokerage.id}`}
            className="text-sm text-[#832238] hover:underline mt-2 inline-block"
          >
            {brokerage.name}
          </Link>
        )}
      </div>

      <Card title="Office Details">
        <div className="space-y-3">
          {office.address && (
            <div>
              <p className="text-xs font-medium text-[#6b7270] uppercase tracking-wider">Address</p>
              <p className="text-[#3e4543] mt-1">
                {office.address}<br />
                {office.city}, {office.state} {office.zip}
              </p>
            </div>
          )}
          {office.phone && (
            <div>
              <p className="text-xs font-medium text-[#6b7270] uppercase tracking-wider">Phone</p>
              <p className="text-[#3e4543] mt-1">{office.phone}</p>
            </div>
          )}
          {office.email && (
            <div>
              <p className="text-xs font-medium text-[#6b7270] uppercase tracking-wider">Email</p>
              <a href={`mailto:${office.email}`} className="text-[#832238] hover:underline mt-1 inline-block">
                {office.email}
              </a>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <p className="text-3xl font-bold text-[#3e4543]">{officeAgents.length}</p>
        <p className="text-sm text-[#6b7270] mt-1">Active agents</p>
      </Card>

      <Card title="Agents">
        {officeAgents.length === 0 ? (
          <p className="text-[#6b7270] text-sm">No agents found for this office.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {officeAgents.map((agent) => {
              const headshot = getAgentPhotos(agent.id).find((p) => p.type === "headshot");
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
                    {agent.title && (
                      <p className="text-sm text-[#6b7270] truncate">{agent.title}</p>
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
