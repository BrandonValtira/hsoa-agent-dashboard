import type {
  AgentRosterStore,
  Organization,
  Office,
  Agent,
  AgentPhoto,
  ClientQuote,
  SoldProperty,
  AgentMetrics,
} from "../types/model";

const org: Organization = {
  id: "org-1",
  name: "HSoA Realty",
  slug: "hsoa",
};

const offices: Office[] = [
  {
    id: "office-1",
    organizationId: "org-1",
    name: "Downtown Office",
    address: "100 Main Street",
    city: "Austin",
    state: "TX",
    zip: "78701",
    phone: "(512) 555-0100",
    email: "downtown@hsoa.com",
  },
  {
    id: "office-2",
    organizationId: "org-1",
    name: "North Office",
    address: "5000 Research Blvd",
    city: "Austin",
    state: "TX",
    zip: "78758",
    phone: "(512) 555-0200",
    email: "north@hsoa.com",
  },
];

const agents: Agent[] = [
  {
    id: "agent-1",
    officeId: "office-1",
    firstName: "Jordan",
    lastName: "Smith",
    email: "jordan.smith@hsoa.com",
    phone: "(512) 555-1001",
    title: "Senior Agent",
    bio: "With over 12 years of experience in Austin real estate, I help buyers and sellers navigate the market with confidence. My focus is on clear communication and results.",
    licenseNumber: "12345678",
    licenseState: "TX",
    joinedAt: "2018-03-15",
    isActive: true,
  },
  {
    id: "agent-2",
    officeId: "office-2",
    firstName: "Morgan",
    lastName: "Chen",
    email: "morgan.chen@hsoa.com",
    phone: "(512) 555-1002",
    title: "Broker Associate",
    bio: "Specializing in first-time buyers and luxury listings. Let's find the right fit for you.",
    licenseNumber: "87654321",
    licenseState: "TX",
    joinedAt: "2020-07-01",
    isActive: true,
  },
];

const agentPhotos: AgentPhoto[] = [
  {
    id: "photo-1",
    agentId: "agent-1",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    caption: "Professional headshot",
    sortOrder: 0,
    type: "headshot",
  },
  {
    id: "photo-2",
    agentId: "agent-1",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=300&fit=crop",
    caption: "Cover banner",
    sortOrder: 0,
    type: "banner",
  },
  {
    id: "photo-3",
    agentId: "agent-2",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    caption: "Headshot",
    sortOrder: 0,
    type: "headshot",
  },
];

const clientQuotes: ClientQuote[] = [
  {
    id: "quote-1",
    agentId: "agent-1",
    quote: "Jordan made our first home purchase smooth and stress-free. Couldn't recommend more.",
    clientName: "Sarah M.",
    saleType: "buyer",
    createdAt: "2024-06-01",
    displayOrder: 0,
  },
  {
    id: "quote-2",
    agentId: "agent-1",
    quote: "Professional, responsive, and got us over ask in a competitive market.",
    clientInitials: "J. & K.",
    saleType: "seller",
    createdAt: "2024-08-15",
    displayOrder: 1,
  },
  {
    id: "quote-3",
    agentId: "agent-2",
    quote: "Morgan understood exactly what we were looking for and found it.",
    clientName: "The Rivera Family",
    saleType: "buyer",
    createdAt: "2024-09-01",
    displayOrder: 0,
  },
];

const soldProperties: SoldProperty[] = [
  {
    id: "sold-1",
    agentId: "agent-1",
    address: "2400 Lake Austin Blvd",
    city: "Austin",
    state: "TX",
    zip: "78703",
    salePrice: 1_250_000,
    saleDate: "2024-10-01",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    displayOrder: 0,
  },
  {
    id: "sold-2",
    agentId: "agent-1",
    address: "1505 W 6th St",
    city: "Austin",
    state: "TX",
    zip: "78703",
    salePrice: 685_000,
    saleDate: "2024-09-15",
    displayOrder: 1,
  },
  {
    id: "sold-3",
    agentId: "agent-2",
    address: "9012 Mesa Dr",
    city: "Austin",
    state: "TX",
    zip: "78759",
    salePrice: 920_000,
    saleDate: "2024-10-10",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    displayOrder: 0,
  },
];

const agentMetrics: AgentMetrics[] = [
  {
    agentId: "agent-1",
    year: 2024,
    totalSales: 42,
    volume: 18_500_000,
    rankInOffice: 1,
    rankInOrg: 2,
    averagePrice: 440_476,
  },
  {
    agentId: "agent-1",
    year: 2023,
    totalSales: 38,
    volume: 15_200_000,
    rankInOffice: 1,
    rankInOrg: 3,
    averagePrice: 400_000,
  },
  {
    agentId: "agent-2",
    year: 2024,
    totalSales: 28,
    volume: 12_100_000,
    rankInOffice: 2,
    rankInOrg: 5,
    averagePrice: 432_143,
  },
];

function toRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
  return Object.fromEntries(arr.map((item) => [item.id, item]));
}

export const mockStore: AgentRosterStore = {
  organizations: toRecord([org]),
  offices: toRecord(offices),
  agents: toRecord(agents),
  agentPhotos: toRecord(agentPhotos),
  clientQuotes: toRecord(clientQuotes),
  soldProperties: toRecord(soldProperties),
  agentMetrics,
};
