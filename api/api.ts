'use server';
import { auth } from '@/auth';
import { graphqlAuthToken, url } from '@/config';
import { format } from 'date-fns/esm';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

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
  return_type?: '' | 'match volatility'
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
  return data.portfolio_holdings as {
    date: string;
    s0: string;
    s1: string;
    s2: string;
    s3: string;
    s4: string;
    s5: string;
    s6: string;
    s7: string;
    s8: string;
    s9: string;
    s10: string;
    s11: string;
    s12: string;
    s13: string;
    s14: string;
    s15: string;
    s16: string;
    s17: string;
    s18: string;
    s19: string;
  }[];
}

export async function getPortfolioReturns(
  freq: 'M' | 'Y' = 'M',
  id: string = 'hk_vc0_mom'
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
  return (
    data.portfolio_returns as {
      id: string;
      date: string;
      value: number;
    }[]
  ).map((d) => ({
    ...d,
    date: format(new Date(d.date), freq === 'M' ? 'yyyy-MM' : 'yyyy')
  }));
}

export async function getPortfolioHoldingsDetail(
  dates?: string[],
  id: string = 'hk_vc0_mom'
) {
  const { data } = await fetchGraphQL(
    `
  query PortfolioHoldingsDetail($id: String!, $dates: [String]) {
    portfolio_holidings_detail(id: $id, dates: $dates) {
      date
      ticker
      name
      industry
      fret
      fret_1m
      fret_2m
      fret_3m
      fret_4m
      fret_5m
      fret_6m
      fret_7m
      fret_8m
      fret_9m
      fret_10m
      fret_11m
      fret_12m
    }
  }`,
    'PortfolioHoldingsDetail',
    { id, dates }
  );
  return data.portfolio_holidings_detail as {
    date: string;
    ticker: string;
    name: string;
    industry: string;
    fret: number | null;
    fret_1m: number | null;
    fret_2m: number | null;
    fret_3m: number | null;
    fret_4m: number | null;
    fret_5m: number | null;
    fret_6m: number | null;
    fret_7m: number | null;
    fret_8m: number | null;
    fret_9m: number | null;
    fret_10m: number | null;
    fret_11m: number | null;
    fret_12m: number | null;
  }[];
}

export async function getPortfolioMetrics(id: string = 'hk_vc0_mom') {
  const { data } = await fetchGraphQL(
    `
  query PortfolioMetrics($id: String!) {
    portfolio_metrics(id: $id) {
      id
      key
      value
    }
  }`,
    'PortfolioMetrics',
    { id }
  );
  return data.portfolio_metrics as { id: string; key: string; value: string }[];
}

export type Indicator =
  | 'beta' // 策略相对于市场的beta值
  | 'volatility' // 波动率
  | 'sharpe' // 夏普率
  | 'sortino'; // 索提诺率
export async function getPortfolioRollingIndicator(
  indicator: Indicator = 'beta',
  roll_window: string = '6M',
  id: string = 'hk_vc0_mom'
) {
  const { data } = await fetchGraphQL(
    `
  query PortfolioRollingIndicator($id: String!, $indicator: String!="beta", $roll_window: String) {
    portfolio_rolling_indicator(id: $id, indicator: $indicator, roll_window: $roll_window) {
      id
      date
      value
    }
  }`,
    'PortfolioRollingIndicator',
    { id, indicator, roll_window }
  );
  return data?.portfolio_rolling_indicator as {
    id: string;
    date: string;
    value: number;
  }[];
}

export async function getPortfolioDrawdowns(id: string = 'hk_vc0_mom') {
  const { data } = await fetchGraphQL(
    `query PortfolioDrawdowns($id: String!) {
  portfolio_drawdowns(id: $id) {
    Start
    End
    Drawdown
    Days
  }
}`,
    'PortfolioDrawdowns',
    { id }
  );
  return data.portfolio_drawdowns as {
    Start: string;
    End: string;
    Drawdown: number;
    Days: number;
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
  const body = {
    query,
    variables,
    operationName
  };
  const token =
    typeof window === 'undefined'
      ? (await auth())?.user?.auth
      : (await getSession())?.user?.auth;
  const res = await fetch(url + '/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: graphqlAuthToken,
      Authorization2: token,
      ...header
    },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (json.errors) {
    const errInfo = json.errors[0];
    if (errInfo.extensions.code === 403) {
      redirect('/login');
      // throw Error('Unauthorized');
    } else {
      throw Error(errInfo.message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('graphql response', operationName);
  }
  return json;
}
