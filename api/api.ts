'use server';
import { auth } from '@/auth';
import { url, graphqlAuthToken } from '@/config';

export async function login(username: string, password: string) {
  const res = await fetchGraphQL(
    `
    query Login($username: String!, $password: String!) {
      login_password(username: $username, password: $password) {
        access_token
        token_type
      }
    }
  `,
    'Login',
    { username, password }
  );
  const { errors, data } = res;
  if (errors) {
    throw errors;
  }
  return data.login_password as { access_token: string; token_type: string };
}

export async function getPortfolioValues(
  start_date?: string,
  end_date?: string,
  id: string = 'hk_vc0_mom',
  return_type?: '' | 'match volatility',
) {
  const { data } = await fetchGraphQL(
    `
  query PortfolioValues($id: String!, $return_type: String, $start_date: timestamp, $end_date: timestamp) {
    portfolio_values(id: $id, return_type: $return_type, start_date: $start_date, end_date: $end_date) {
      id
      date
      value
    }
  }`,
    'PortfolioValues',
    { id, return_type, start_date, end_date }
  );
  return data.portfolio_values as {
    id: string;
    date: string;
    value: number;
  }[];
}

export async function getPortfolioHoldings(id: string = 'hk_vc0_mom') {
  const { data } = await fetchGraphQL(
    `query PortfolioHoldings($id: String!) {
    portfolio_holdings(id: $id) {
      date
      s0
      s1
      s2
      s3
      s4
      s5
      s6
      s7
      s8
      s9
      s10
      s11
      s12
      s13
      s14
      s15
      s16
      s17
      s18
      s19
    }
  }`,
    'PortfolioHoldings',
    { id }
  );
  return data.portfolio_holdings as { date: string; [key: string]: string }[];
}

export async function getPortfolioReturns(
  freq: 'M' | 'Y' = 'M',
  id: string = 'hk_vc0_mom',
) {
  const { data } = await fetchGraphQL(
    `
  query PortfolioReturns($id: String!, $freq: String="M") {
    portfolio_returns(id: $id, freq: $freq) {
      id
      date
      value
    }
  }`,
    'PortfolioReturns',
    { id, freq }
  );
  return data.portfolio_returns as {
    id: string;
    date: string;
    value: number;
  }[];
}

/**
 * Fetch GraphQL data
 * @param query
 * @param operationName
 * @param variables
 * @param header
 * @returns
 */
async function fetchGraphQL(
  query: string,
  operationName: string = '',
  variables: any = {},
  header: any = {}
) {
  const token = (await auth())?.user?.auth;
  const res = await fetch(url + '/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: graphqlAuthToken,
      Authorization2: token,
      ...header
    },
    body: JSON.stringify({
      query,
      variables,
      operationName
    })
  });
  const json = await res.json();
  if (json.errors) {
    // eslint-disable-next-line no-console
    console.log('graphql error', json);
  }
  return json;
}
