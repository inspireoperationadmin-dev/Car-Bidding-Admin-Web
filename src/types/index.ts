export * from "./api";
import type { components, paths } from "./api";

// Convenient Schema Aliases
export type ApiSchemas = components["schemas"];
export type User = ApiSchemas["User"];
export type AuthResponse = ApiSchemas["AuthResponse"];
export type RequestItem = ApiSchemas["Request"];
export type Bid = ApiSchemas["Bid"];
export type MechanicProfile = ApiSchemas["MechanicProfile"];
export type Notification = ApiSchemas["Notification"];
export type Pagination = ApiSchemas["Pagination"];

// Paths Alias
export type ApiPaths = paths;
