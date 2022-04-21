import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

export interface MenuItem {
  name: string;
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];
