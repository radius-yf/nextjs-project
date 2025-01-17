'use server';
import { format } from 'date-fns/esm';
import { generateKPMGroup } from './KPMGroup';
import { generateSummary } from './summary';
import { Holding } from './holdings';
import { fetchGraphQL } from './fetch';

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
  holding_details: boolean = true,
  id: string = 'hk_vc0_mom'
) {
  const { data } = await fetchGraphQL(
    `
  query PortfolioHoldingsDetail($id: String!, $dates: [String], $holding_details: Boolean) {
    portfolio_holidings_detail(id: $id, dates: $dates, holding_details: $holding_details) {
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
    { id, dates, holding_details }
  );
  return data.portfolio_holidings_detail as Holding[];
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
  const metrics = data.portfolio_metrics as {
    id: string;
    key: string;
    value: string;
  }[];
  return generateKPMGroup(metrics);
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

export async function getPortfolioDrawdowns(
  id: string = 'hk_vc0_mom',
  dd_type: 'worst' | 'longest' = 'worst'
) {
  const { data } = await fetchGraphQL(
    `
  query PortfolioDrawdowns($id: String!, $dd_type: String="worst") {
    portfolio_drawdowns(id: $id, dd_type: $dd_type) {
      Start
      End
      Drawdown
      Days
    }
  }`,
    'PortfolioDrawdowns',
    { id, dd_type }
  );
  return data.portfolio_drawdowns as {
    Start: string;
    End: string;
    Drawdown: number;
    Days: number;
  }[];
}

export async function getPortfolioSummary(id: string = 'hk_vc0_mom') {
  const { data } = await fetchGraphQL(
    `
  query PortfolioSummary($id: String!) {
    portfolio_summary(id: $id) {
      key
      value
    }
  }`,
    'PortfolioSummary',
    { id }
  );
  return generateSummary(data.portfolio_summary);
}
