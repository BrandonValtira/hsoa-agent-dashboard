import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAgentRoster } from "../store/AgentRosterContext";
import { Card } from "../components/Card";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roster = useAgentRoster();
  const agent = id ? roster.agents[id] : undefined;
  const office = agent ? roster.getOffice(agent.officeId) : undefined;
  const brokerage = agent ? roster.getBrokerage(agent.brokerageId) : undefined;
  const photos = agent ? roster.getAgentPhotos(agent.id) : [];
  const quotes = agent ? roster.getClientQuotes(agent.id) : [];
  const sold = agent ? roster.getSoldProperties(agent.id) : [];
  const metrics = agent ? roster.getAgentMetrics(agent.id) : [];

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(agent?.bio ?? "");
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [quoteDraft, setQuoteDraft] = useState({ quote: "", clientName: "" });

  if (!agent) {
    return (
      <div className="space-y-6">
        <p className="text-[#3e4543]">Agent not found.</p>
        <button
          type="button"
          onClick={() => navigate("/agents")}
          className="text-[#3e4543] hover:text-[#832238] transition-colors"
        >
          Back to agents
        </button>
      </div>
    );
  }

  const headshot = photos.find((p) => p.type === "headshot");
  const banner = photos.find((p) => p.type === "banner");

  const saveBio = () => {
    roster.updateAgent(agent.id, { bio: bioDraft });
    setEditingBio(false);
  };

  return (
    <div className="space-y-12 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/agents")}
            className="text-sm text-[#6b7270] hover:text-[#832238] mb-3 transition-colors"
          >
            ← Agents
          </button>
          <h1 className="text-2xl font-bold text-[#3e4543]">
            {agent.firstName} {agent.lastName}
          </h1>
          <p className="text-[#3e4543] mt-1">{agent.title ?? "Agent"}</p>
          {brokerage && (
            <p className="text-sm text-[#6b7270] mt-2">{brokerage.name}</p>
          )}
          {office && (
            <p className="text-sm text-[#6b7270] mt-0.5">{office.name}</p>
          )}
        </div>
      </div>

      {/* Photos */}
      <Card title="Photos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {headshot && (
            <div>
              <p className="text-xs font-medium text-[#6b7270] uppercase tracking-wider mb-3">Headshot</p>
              <img
                src={headshot.url}
                alt={headshot.caption ?? "Headshot"}
                className="w-32 h-32 object-cover rounded-lg border border-[#e8e8e8]"
              />
              <p className="text-xs text-[#6b7270] mt-2">Recommended: 400×400px, JPG or PNG, max 2MB</p>
              <label className="mt-3 inline-flex items-center gap-2 px-3 py-2 border border-[#e8e8e8] rounded-lg text-sm text-[#3e4543] hover:border-[#832238]/30 cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload new photo
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      roster.updateAgentPhoto(headshot.id, { url });
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
          )}
          {banner && (
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-[#6b7270] uppercase tracking-wider mb-3">Banner</p>
              <img
                src={banner.url}
                alt={banner.caption ?? "Banner"}
                className="w-full h-40 object-cover rounded-lg border border-[#e8e8e8]"
              />
              <p className="text-xs text-[#6b7270] mt-2">Recommended: 1200×400px, JPG or PNG, max 2MB</p>
              <label className="mt-3 inline-flex items-center gap-2 px-3 py-2 border border-[#e8e8e8] rounded-lg text-sm text-[#3e4543] hover:border-[#832238]/30 cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload new photo
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      roster.updateAgentPhoto(banner.id, { url });
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </Card>

      {/* Bio */}
      <Card title="Bio">
        {editingBio ? (
          <div>
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              rows={4}
              className="w-full border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#3e4543]"
              placeholder="Write a short bio..."
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={saveBio}
                className="px-4 py-2 bg-[#832238] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setBioDraft(agent.bio ?? "");
                  setEditingBio(false);
                }}
                className="px-4 py-2 border border-[#e8e8e8] text-[#3e4543] text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[#3e4543] whitespace-pre-wrap leading-relaxed">
              {agent.bio || "No bio yet."}
            </p>
            <button
              type="button"
              onClick={() => {
                setBioDraft(agent.bio ?? "");
                setEditingBio(true);
              }}
              className="mt-4 text-sm text-[#3e4543] hover:text-[#832238] transition-colors"
            >
              Edit bio
            </button>
          </div>
        )}
      </Card>

      {/* Brokerage */}
      {brokerage && (
        <Card title="Brokerage">
          <p className="font-medium text-[#3e4543]">{brokerage.name}</p>
          {brokerage.website && (
            <a
              href={brokerage.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#832238] hover:underline mt-2 inline-block"
            >
              Visit website
            </a>
          )}
        </Card>
      )}

      {/* Office */}
      {office && (
        <Card title="Office">
          <p className="font-medium text-[#3e4543]">{office.name}</p>
          {office.address && (
            <p className="text-sm text-[#6b7270] mt-2">
              {office.address}, {office.city}, {office.state} {office.zip}
            </p>
          )}
          {office.phone && (
            <p className="text-sm text-[#6b7270] mt-1">{office.phone}</p>
          )}
          {office.email && (
            <p className="text-sm text-[#6b7270] mt-1">{office.email}</p>
          )}
        </Card>
      )}

      {/* Client quotes */}
      <Card title="Client quotes">
        <ul className="space-y-6">
          {quotes.map((q) => {
            const isEditing = editingQuoteId === q.id;
            const displayName = q.clientName ?? q.clientInitials ?? "Client";
            const attribution = `${displayName}${q.saleType ? ` (${q.saleType})` : ""}`;

            return (
              <li key={q.id} className="border-l-2 border-[#e8e8e8] pl-5 flex gap-4">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div>
                      <textarea
                        value={quoteDraft.quote}
                        onChange={(e) => setQuoteDraft((d) => ({ ...d, quote: e.target.value }))}
                        rows={2}
                        className="w-full text-sm border border-[#e8e8e8] rounded-lg px-3 py-2 text-[#3e4543] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238] resize-none"
                        placeholder="Quote"
                      />
                      <input
                        type="text"
                        value={quoteDraft.clientName}
                        onChange={(e) => setQuoteDraft((d) => ({ ...d, clientName: e.target.value }))}
                        className="mt-3 w-full text-sm border border-[#e8e8e8] rounded-lg px-3 py-2 text-[#3e4543] focus:border-[#832238] focus:outline-none focus:ring-1 focus:ring-[#832238]"
                        placeholder="Client name"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            roster.updateClientQuote(q.id, { quote: quoteDraft.quote, clientName: quoteDraft.clientName || undefined });
                            setEditingQuoteId(null);
                          }}
                          className="px-4 py-2 bg-[#832238] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingQuoteId(null);
                          }}
                          className="px-4 py-2 border border-[#e8e8e8] text-[#3e4543] text-sm rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[#3e4543] italic leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
                      <p className="text-sm text-[#6b7270] mt-2">— {attribution}</p>
                    </>
                  )}
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuoteId(q.id);
                      setQuoteDraft({ quote: q.quote, clientName: displayName });
                    }}
                    className="flex-shrink-0 self-start text-sm text-[#6b7270] hover:text-[#832238] transition-colors"
                  >
                    Edit
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => roster.addClientQuote(agent.id, { quote: "", clientName: "" })}
          className="mt-6 flex items-center gap-2 px-3 py-2 border border-dashed border-[#e8e8e8] rounded-lg text-sm text-[#6b7270] hover:border-[#832238]/30 hover:text-[#832238] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add new quote
        </button>
      </Card>

      {/* Recently sold */}
      <Card title="Recently sold">
        {sold.length === 0 ? (
          <p className="text-[#6b7270] text-sm">No sold properties yet.</p>
        ) : (
          <ul className="space-y-5">
            {sold.map((s) => (
              <li key={s.id} className="flex gap-5 border border-[#e8e8e8] rounded-lg p-4">
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#3e4543]">
                    {s.address}, {s.city}, {s.state} {s.zip}
                  </p>
                  <p className="text-sm text-[#6b7270] mt-1">
                    Sold {formatDate(s.saleDate)} · {formatCurrency(s.salePrice)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Sales metrics */}
      <Card title="Sales metrics">
        {metrics.length === 0 ? (
          <p className="text-[#6b7270] text-sm">No metrics yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8] text-left text-[#6b7270]">
                  <th className="pb-3 pr-6">Year</th>
                  <th className="pb-3 pr-6">Transactions</th>
                  <th className="pb-3 pr-6">Volume</th>
                  <th className="pb-3 pr-6">Avg price</th>
                  <th className="pb-3">Rank (office)</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={`${m.agentId}-${m.year}`} className="border-b border-[#e8e8e8]">
                    <td className="py-3 pr-6 font-medium text-[#3e4543]">{m.year}</td>
                    <td className="py-3 pr-6 text-[#3e4543]">{m.totalSales}</td>
                    <td className="py-3 pr-6 text-[#3e4543]">{formatCurrency(m.volume)}</td>
                    <td className="py-3 pr-6 text-[#3e4543]">{m.averagePrice ? formatCurrency(m.averagePrice) : "—"}</td>
                    <td className="py-3 text-[#3e4543]">{m.rankInOffice ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
