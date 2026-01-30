import { Link } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";
import { Card } from "../components/Card";

export function Dashboard() {
  const { agents, offices, getOffice } = useAgentRoster();
  const agentList = Object.values(agents).filter((a) => a.isActive);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-[#3e4543]">Dashboard</h1>
        <p className="text-[#3e4543] mt-2 text-[15px]">Agent roster and organizational data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">{agentList.length}</p>
          <p className="text-sm text-[#6b7270] mt-1">Active agents</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">{Object.keys(offices).length}</p>
          <p className="text-sm text-[#6b7270] mt-1">Offices</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-[#3e4543]">HSoA</p>
          <p className="text-sm text-[#6b7270] mt-1">Organization</p>
        </Card>
      </div>

      <Card title="Agents">
        <ul className="divide-y divide-[#e8e8e8]">
          {agentList.map((agent) => {
            const office = getOffice(agent.officeId);
            return (
              <li key={agent.id} className="py-5 first:pt-0 last:pb-0">
                <Link
                  to={`/agents/${agent.id}`}
                  className="flex flex-wrap items-center gap-2 text-[#3e4543] hover:text-[#832238] font-medium transition-colors"
                >
                  {agent.firstName} {agent.lastName}
                  {office && (
                    <span className="text-[#6b7270] font-normal text-sm">— {office.name}</span>
                  )}
                </Link>
                <p className="text-sm text-[#6b7270] mt-1">{agent.email}</p>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
