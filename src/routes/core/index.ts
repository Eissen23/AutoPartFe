import type { RouteObject } from "react-router";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";

export const coreRoutes: RouteObject[] = [...authRoutes, ...dashboardRoutes];
