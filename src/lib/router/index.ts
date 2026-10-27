/*
  Public surface for the runes router.
  Re-exports Router, Route and the link action so callers can import from
  a single stable path, mirroring the old svelte-routing import style:

      import { Router, Route } from '../router';
      import { link } from '../router';
*/

export { default as Router } from './Router.svelte';
export { default as Route } from './Route.svelte';
export type { RouterContext, RouterProps, Params } from './context';
export { link } from './link';
