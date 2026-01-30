/**
 * Relational data model – single source of truth for agent and organizational data.
 * Refine entities and fields as real APIs and requirements are defined.
 */

export type PhotoType = "headshot" | "banner" | "gallery";

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string;
}

export interface Office {
  id: string;
  organizationId: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
}

export interface Agent {
  id: string;
  officeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string; // e.g. "Senior Agent", "Broker Associate"
  bio?: string;
  licenseNumber?: string;
  licenseState?: string;
  joinedAt?: string; // ISO date
  isActive: boolean;
}

export interface AgentPhoto {
  id: string;
  agentId: string;
  url: string;
  caption?: string;
  sortOrder: number;
  type: PhotoType;
  uploadedAt?: string;
}

export interface ClientQuote {
  id: string;
  agentId: string;
  quote: string;
  clientName?: string;
  clientInitials?: string; // for privacy
  saleType?: "buyer" | "seller" | "both";
  createdAt: string;
  displayOrder?: number;
}

export interface SoldProperty {
  id: string;
  agentId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  salePrice: number;
  saleDate: string; // ISO date
  imageUrl?: string;
  mlsId?: string;
  displayOrder?: number;
}

export interface AgentMetrics {
  agentId: string;
  year: number;
  totalSales: number; // transaction count
  volume: number; // total $ volume
  rankInOffice?: number;
  rankInOrg?: number;
  averagePrice?: number;
}

/** Normalized store shape – one place to hold all entities */
export interface AgentRosterStore {
  organizations: Record<string, Organization>;
  offices: Record<string, Office>;
  agents: Record<string, Agent>;
  agentPhotos: Record<string, AgentPhoto>;
  clientQuotes: Record<string, ClientQuote>;
  soldProperties: Record<string, SoldProperty>;
  agentMetrics: AgentMetrics[];
}
