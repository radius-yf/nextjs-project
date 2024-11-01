import { format } from 'date-fns/esm';
import { fetchGraphQL } from './fetch';
import { groupBy } from '@/lib/data-conversion';
import { zip } from '@/lib/utils';

/**
 * 实盘id列表
 */
export async function getReportOnlineIdlist() {
  const { data } = await fetchGraphQL(
    `
    query ReportOnlineIdlist {
      v2_report_online_idlist {
        id
        name: value
      }
    }`,
    'ReportOnlineIdlist'
  );
  return data.v2_report_online_idlist as { id: string; name: string }[];
}

/**
 * 获取回测历史配置
 */
export async function getBacktestGetConfig() {
  const { data } = await fetchGraphQL(
    `
    query BacktestGetConfig {
      v2_backtest_get_config {
        bt_id
        data
        update_time
      }
    }`,
    'BacktestGetConfig'
  );
  return data.v2_backtest_get_config as {
    bt_id: string;
    data: string;
    update_time: string;
  }[];
}

/**
 * 回测参数
 */
export async function getBacktestFilter() {
  const { data } = await fetchGraphQL(
    `
    query BacktestFilter {
      v2_backtest_filter
    }`,
    'BacktestFilter'
  );
  return data.v2_backtest_filter as string;
}

/**
 * 回测任务状态
 * @param pid_list 回测id
 */
export async function getBacktestGetMultiProcessStatus(pid_list: string[]) {
  const { data } = await fetchGraphQL(
    `
    query BacktestGetMultiProcessStatus($pid_list: [String!]!) {
      v2_backtest_get_multi_process_status(pid_list: $pid_list)
    }`,
    'BacktestGetMultiProcessStatus',
    { pid_list }
  );
  return zip(pid_list, data.v2_backtest_get_multi_process_status as string[]);
}

export interface BacktestParams {
  region: string;
  start_date: string;
  end_date: string;
  stock_filter: string;
  rf: string;
  strategy: string;
  position: string;
  industry: string[];
  stock_count: number;
  holding_time: string;
}
/**
 * 创建回测任务
 * @param bt_args 回测参数
 * @returns id
 */
export async function backtestCreateProcess(bt_args: BacktestParams) {
  const { data } = await fetchGraphQL(
    `
    query BacktestCreateProcess($bt_args: String!) {
      v2_backtest_create_process(bt_args: $bt_args)
    }`,
    'BacktestCreateProcess',
    { bt_args: JSON.stringify(bt_args) }
  );
  return data.v2_backtest_create_process as string;
}

/**
 * 投资组合累计收益率(vs基准数据)
 */
export async function getReportPortfolioValues(
  id: string,
  start_date?: Date | string,
  end_date?: Date | string,
  return_type: '' | 'match volatility' | 'log' = '',
  freq: string = 'd'
) {
  const { data } = await fetchGraphQL(
    `
    query ReportPortfolioValues($id: String!, $return_type: String, $start_date: timestamp, $end_date: timestamp,$freq:String) {
      v2_report_portfolio_values(id: $id, return_type: $return_type, start_date: $start_date, end_date: $end_date,freq: $freq) {
        id
        date
        value
      }
    }`,
    'ReportPortfolioValues',
    {
      id,
      return_type,
      start_date: start_date
        ? format(new Date(start_date), 'yyyy-MM-dd')
        : undefined,
      end_date: end_date ? format(new Date(end_date), 'yyyy-MM-dd') : undefined,
      freq
    }
  );
  return data.v2_report_portfolio_values as {
    id: string;
    date: string;
    value: number;
  }[];
}

/**
 * 投资组合收益率(vs基准收益率)
 */
export async function getReportPortfolioReturns(
  id: string,
  freq: 'm' | 'y',
  start_date?: Date | string,
  end_date?: Date | string
) {
  const { data } = await fetchGraphQL(
    `
    query ReportPortfolioReturns($id: String!, $freq:String!, $start_date: timestamp, $end_date: timestamp) {
      v2_report_portfolio_returns(id: $id, start_date: $start_date, end_date: $end_date,freq: $freq) {
        id
        date
        value
      }
    }`,
    'ReportPortfolioReturns',
    {
      id,
      freq,
      start_date: start_date
        ? format(new Date(start_date), 'yyyy-MM-dd')
        : undefined,
      end_date: end_date ? format(new Date(end_date), 'yyyy-MM-dd') : undefined
    }
  );
  return data.v2_report_portfolio_returns as {
    id: string;
    date: string;
    value: number;
  }[];
}

/**
 * 投资组合收益统计指标(key performance metrics)
 */
export async function getReportPortfolioMetrics(
  id: string,
  start_date?: Date | string,
  end_date?: Date | string
) {
  const data = await getReportPortfolioMetricsRowData(id, start_date, end_date);
  return groupBy(data, 'id').map(
    ([id, val]) =>
      ({
        id,
        ...val?.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
      }) as Record<string, string> & { id: string }
  );
}
export async function getReportPortfolioMetricsRowData(
  id: string,
  start_date?: Date | string,
  end_date?: Date | string
) {
  const { data } = await fetchGraphQL(
    `
      query ReportPortfolioMetrics($id: String!, $start_date: timestamp, $end_date: timestamp) {
        v2_report_portfolio_metrics(id: $id, start_date: $start_date, end_date: $end_date) {
          id
          key
          value
        }
      }`,
    'ReportPortfolioMetrics',
    {
      id,
      start_date: start_date
        ? format(new Date(start_date), 'yyyy-MM-dd')
        : undefined,
      end_date: end_date ? format(new Date(end_date), 'yyyy-MM-dd') : undefined
    }
  );
  return data.v2_report_portfolio_metrics as {
    id: string;
    key: string;
    value: string;
  }[];
}

/**
 * 投资组合滚动统计指标(rolling indicator)
 */
export async function getReportPortfolioRollingIndicator(
  id: string,
  start_date?: Date | string,
  end_date?: Date | string,
  indicator: 'beta' | 'volatility' | 'sharpe' | 'sortino' = 'beta',
  roll_window: '6M' | '12M' = '6M'
) {
  const { data } = await fetchGraphQL(
    `query ReportPortfolioRollingIndicator($id: String!, $indicator: String!="beta", $roll_window: String, $start_date: timestamp, $end_date: timestamp) {
      v2_report_portfolio_rolling_indicator(id: $id, indicator: $indicator, roll_window: $roll_window, start_date: $start_date, end_date: $end_date) {
        id
        date
        value
      }
    }`,
    'ReportPortfolioRollingIndicator',
    {
      id,
      start_date: start_date
        ? format(new Date(start_date), 'yyyy-MM-dd')
        : undefined,
      end_date: end_date ? format(new Date(end_date), 'yyyy-MM-dd') : undefined,
      indicator,
      roll_window
    }
  );
  return data?.v2_report_portfolio_rolling_indicator as {
    id: string;
    date: string;
    value: number;
  }[];
}

/**
 * 投资组合关键指标KeyRatios(vs 市场)
 */
export async function getReportPortfolioKeyRatios(
  id: string,
  start_date?: Date | string,
  end_date?: Date | string
) {
  const { data } = await fetchGraphQL(
    `
    query ReportPortfolioKeyRatios($id: String!, $start_date: timestamp, $end_date: timestamp) {
      v2_report_portfolio_keyratios(id: $id, end_date: $end_date) {
        key
        low
        mean
        up
        value
      }
    }`,
    'ReportPortfolioKeyRatios',
    {
      id,
      // start_date: start_date
      //   ? format(new Date(start_date), 'yyyy-MM-dd')
      //   : undefined,
      end_date: end_date ? format(new Date(end_date), 'yyyy-MM-dd') : undefined
    }
  );
  return data.v2_report_portfolio_keyratios as {
    key: string;
    low: number;
    mean: number;
    up: number;
    value: number;
  }[];
}

/**
 * 投资组合持仓行业市值百分比
 */
export async function getReportPortfolioHoldingsIndustry(
  id: string,
  start_date?: Date | string,
  end_date?: Date | string
) {
  const { data } = await fetchGraphQL(
    `
    query ReportPortfolioHoldingsIndustry($id: String!, $start_date: timestamp, $end_date: timestamp) {
      v2_report_portfolio_holdings_industry(id: $id, end_date: $end_date) {
        id
        value
      }
    }`,
    'ReportPortfolioHoldingsIndustry',
    {
      id,
      // start_date: start_date
      //   ? format(new Date(start_date), 'yyyy-MM-dd')
      //   : undefined,
      end_date: end_date ? format(new Date(end_date), 'yyyy-MM-dd') : undefined
    }
  );
  return data.v2_report_portfolio_holdings_industry as {
    id: string;
    value: number;
  }[];
}

/**
 * 投资组合回撤区间(Drawdowns)
 */
export async function getReportPortfolioDrawdowns(
  id: string,
  start_date?: Date | string,
  end_date?: Date | string,
  dd_type: 'worst' | 'longest' = 'worst'
) {
  const { data } = await fetchGraphQL(
    `query ReportPortfolioDrawdowns($id: String!, $dd_type: String, $start_date: timestamp, $end_date: timestamp) {
      v2_report_portfolio_drawdowns(id: $id, dd_type: $dd_type, start_date: $start_date, end_date: $end_date) {
        Days
        Drawdown
        End
        Start
      }
    }`,
    'ReportPortfolioDrawdowns',
    {
      id,
      start_date: start_date
        ? format(new Date(start_date), 'yyyy-MM-dd')
        : undefined,
      end_date: end_date ? format(new Date(end_date), 'yyyy-MM-dd') : undefined,
      dd_type
    }
  );
  return data.v2_report_portfolio_drawdowns as {
    id: string;
    date: string;
    value: number;
  }[];
}
