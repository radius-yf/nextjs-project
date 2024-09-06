import { auth } from '@/auth';

const url = 'http://47.121.124.98:8066';
const Authorization =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6IlpoYW5nIFBlaXl1YW4iLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTUxNjIzOTAyMiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJwLWZyb250ZW5kIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJwLWZyb250ZW5kIl0sIngtaGFzdXJhLXVzZXItaWQiOiIyIiwieC1oYXN1cmEtb3JnLWlkIjoiNDU2IiwieC1oYXN1cmEtY3VzdG9tIjoiY3VzdG9tLXZhbHVlIn19.bY0657jga1wMmzlBF-T1cWQ9FhCzH6tYE8qs6GXneK0';

async function fetchGraphQL(
  query: string,
  operationName: string = '',
  variables: any = {},
  header: any = {},
  token: string = ''
) {
  const res = await fetch(url + '/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Authorization,
      Authorization2: token,
      ...header
    },
    body: JSON.stringify({
      query,
      variables,
      operationName
    })
  });
  return await res.json();
}

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

export function serverApi() {
  let token: string | undefined = undefined;
  const _fetchGraphQL = async (
    query: string,
    operationName: string = '',
    variables: any = {},
    header: any = {}
  ) => {
    token = token ? token : (await auth())?.user?.auth;
    return fetchGraphQL(query, operationName, variables, header, token);
  };

  async function getPortfolioValues(
    id: string = 'hk_vc0_mom',
    return_type?: '' | 'match volatility'
  ) {
    const { data } = await _fetchGraphQL(
      `
    query PortfolioValues($id: String!, $return_type: String, $start_date: timestamp, $end_date: timestamp) {
      portfolio_values(id: $id, return_type: $return_type, start_date: $start_date, end_date: $end_date) {
        id
        date
        value
      }
    }`,
      'PortfolioValues',
      { id, return_type }
    );
    return data.portfolio_values as {
      id: string;
      date: string;
      value: number;
    }[];
  }

  async function getPortfolioHoldings(id: string = 'hk_vc0_mom') {
    const { data } = await _fetchGraphQL(
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

  return { getPortfolioValues, getPortfolioHoldings };
}
