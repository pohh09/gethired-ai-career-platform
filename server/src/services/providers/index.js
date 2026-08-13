import { JoobleProvider } from "./joobleProvider.js";
import { JSearchProvider } from "./jsearchProvider.js";
import { AdzunaProvider } from "./adzunaProvider.js";
import { ArbeitnowProvider } from "./arbeitnowProvider.js";
import { RemotiveProvider } from "./remotiveProvider.js";
import { RemoteOKProvider } from "./remoteOKProvider.js";
import { RapidJobsProvider } from "./rapidJobsProvider.js";
import { USAJobsProvider } from "./usajobsProvider.js";
import { GreenhouseProvider } from "./greenhouseProvider.js";
import { LeverProvider } from "./leverProvider.js";

export const ALL_PROVIDERS = [
  new JoobleProvider(),
  new JSearchProvider(),
  new AdzunaProvider(),
  new ArbeitnowProvider(),
  new RemotiveProvider(),
  new RemoteOKProvider(),
  new RapidJobsProvider(),
  new USAJobsProvider(),
  new GreenhouseProvider(),
  new LeverProvider(),
];

export function getActiveProviders() {
  const envProviders = process.env.ACTIVE_PROVIDERS
    ? process.env.ACTIVE_PROVIDERS.split(",").map((p) => p.trim().toLowerCase())
    : null;

  if (envProviders && envProviders.length > 0) {
    return ALL_PROVIDERS.filter((p) => envProviders.includes(p.name.toLowerCase()));
  }

  const searchOrder = ["jooble", "jsearch", "adzuna", "arbeitnow", "remotive", "remoteok"];

  return searchOrder
    .map((name) => ALL_PROVIDERS.find((p) => p.name.toLowerCase() === name))
    .filter(Boolean);
}

export {
  JoobleProvider,
  JSearchProvider,
  AdzunaProvider,
  ArbeitnowProvider,
  RemotiveProvider,
  RemoteOKProvider,
  RapidJobsProvider,
  USAJobsProvider,
  GreenhouseProvider,
  LeverProvider,
};
