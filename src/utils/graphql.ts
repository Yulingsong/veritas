/**
 * GraphQL Utilities
 */

import { httpRequest } from '../utils/api.js';

/**
 * GraphQL client for testing
 */
export class GraphQLClient {
  private endpoint: string;
  private headers: Record<string, string>;

  constructor(endpoint: string, headers: Record<string, string> = {}) {
    this.endpoint = endpoint;
    this.headers = headers;
  }

  /**
   * Execute query
   */
  async query<T>(query: string, variables?: Record<string, any>): Promise<GraphQLResponse<T>> {
    const response = await httpRequest(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers
      },
      body: JSON.stringify({ query, variables })
    });

    return response.data;
  }

  /**
   * Execute mutation
   */
  async mutate<T>(mutation: string, variables?: Record<string, any>): Promise<GraphQLResponse<T>> {
    return this.query<T>(mutation, variables);
  }
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
}

/**
 * Parse GraphQL schema
 */
export function parseGraphQLSchema(schema: string): SchemaInfo {
  const types: string[] = [];
  const queries: string[] = [];
  const mutations: string[] = [];

  // Simple regex-based parsing
  const typeMatch = schema.matchAll(/type\s+(\w+)\s*{/g);
  for (const match of typeMatch) {
    types.push(match[1]);
  }

  const queryMatch = schema.matchAll(/type\s+Query\s*{([^}]+)}/g);
  for (const match of queryMatch) {
    queries.push(...match[1].trim().split('\n').map(s => s.trim()).filter(Boolean));
  }

  const mutationMatch = schema.matchAll(/type\s+Mutation\s*{([^}]+)}/g);
  for (const match of mutationMatch) {
    mutations.push(...match[1].trim().split('\n').map(s => s.trim()).filter(Boolean));
  }

  return { types, queries, mutations };
}

export interface SchemaInfo {
  types: string[];
  queries: string[];
  mutations: string[];
}

/**
 * Generate GraphQL mock
 */
export function generateGraphQLMocks(schema: string): string {
  const info = parseGraphQLSchema(schema);
  let mocks = '// GraphQL Mocks\n\n';

  for (const query of info.queries) {
    const name = query.split(':')[0].trim();
    mocks += `export const mock${capitalize(name)} = {};\n`;
  }

  return mocks;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default { GraphQLClient, parseGraphQLSchema, generateGraphQLMocks };
