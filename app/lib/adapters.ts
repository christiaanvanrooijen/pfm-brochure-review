import type {
  CompletionIntent,
  ProofFixture,
  QuoteBuilderPayload,
  QuoteBuilderResult,
} from "./types";
import { proofItems } from "./fixtures";

export interface OdooAdapter {
  complete(intent: CompletionIntent): Promise<{ reference: string; simulated: true }>;
}

export interface QuoteBuilderAdapter {
  save(payload: QuoteBuilderPayload): Promise<QuoteBuilderResult>;
}

export interface ContentAdapter {
  getProof(): Promise<ProofFixture[]>;
}

export interface IdentityAdapter {
  getViewer(): Promise<{ displayName: string; simulated: true }>;
}

export interface AnalyticsAdapter {
  record(event: string): Promise<{ accepted: true; simulated: true }>;
}

const resolveDemo = <T,>(value: T): Promise<T> => Promise.resolve(value);

export const demoAdapters = {
  odoo: {
    complete: (intent: CompletionIntent) => {
      void intent;
      return resolveDemo({ reference: "CRM-DEMO-018", simulated: true as const });
    },
  } satisfies OdooAdapter,
  quoteBuilder: {
    save: (payload: QuoteBuilderPayload) => {
      void payload;
      return resolveDemo({
        schema_version: "demo-v1" as const,
        configuration_id: "cfg_demo_001",
        quotation_draft_id: null,
        status: "saved" as const,
        review_required: true as const,
      });
    },
  } satisfies QuoteBuilderAdapter,
  content: {
    getProof: () => resolveDemo(proofItems),
  } satisfies ContentAdapter,
  identity: {
    getViewer: () =>
      resolveDemo({ displayName: "Demo presenter", simulated: true as const }),
  } satisfies IdentityAdapter,
  analytics: {
    record: (event: string) => {
      void event;
      return resolveDemo({ accepted: true as const, simulated: true as const });
    },
  } satisfies AnalyticsAdapter,
};
