import { Link } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";

export function AgentList() {
  const { agents, getOffice, getAgentPhotos } = useAgentRoster();
  const agentList = Object.values(agents).filter((a) => a.isActive);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-[#3e4543]">Agents</h1>
        <p className="text-[#3e4543] mt-2 text-[15px]">Select an agent to edit profile, photos, bio, and metrics</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {agentList.map((agent) => {
          const office = getOffice(agent.officeId);
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
                  {office && (
                    <p className="text-sm text-[#6b7270] mt-1">{office.name}</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
