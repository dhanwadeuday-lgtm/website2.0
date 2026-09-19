// Shared types for the SnickyLink pairing API (Vercel serverless + Upstash Redis).

export interface Person {
  name: string;
  email: string;
}

export interface PairRecord {
  code: string;
  position: number;
  person1: Person;
  person2: Person | null;
  connected: boolean;
  createdAt: string;
  connectedAt: string | null;
}

export type JoinError = 'not_found' | 'already_paired' | 'same_email';

export interface JoinSuccess {
  record: PairRecord;
  error?: undefined;
}

export interface JoinFailure {
  record?: undefined;
  error: JoinError;
}

export type JoinResult = JoinSuccess | JoinFailure;

// Request bodies the frontend (app.js) sends.
export interface CreatePairBody {
  name?: string;
  email?: string;
}

export interface JoinPairBody {
  code?: string;
  name?: string;
  email?: string;
}

// Response payloads the frontend expects back.
export interface CreatePairResponse {
  code: string;
  position: number;
}

export interface JoinPairResponse {
  person1Name: string | null;
  code: string;
}

export interface StatusResponse {
  code: string;
  connected: boolean;
  person1Name: string | null;
  person2Name: string | null;
  position: number;
}

export interface ApiErrorResponse {
  error: string;
}
