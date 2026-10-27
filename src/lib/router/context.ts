/*
  Router context symbol + shared `RouterContext` type.
  Imported by Router.svelte (provider) and Route.svelte (consumer) so both
  reference the same symbol and type.
*/

import type { Snippet } from 'svelte';

export const ROUTER = Symbol('router');

export type Params = Record<string, string>;

export interface RouteEntry {
  id: string;
  path: string;
}

export interface RouterContext {
  readonly path: string;
  readonly activeRoute: { path: string; params: Params } | null;
  navigate: (to: string) => void;
  registerRoute: (id: string, path: string) => void;
  unregisterRoute: (id: string) => void;
}

export interface RouterProps {
  children: Snippet;
}
