import { group } from '@/lib/data-conversion';

const groups = [
  { key: 'Start Period', group: 'Summary' },
  { key: 'End Period', group: 'Summary' },
  { key: 'Risk-Free Rate % ', group: 'Summary' },
  { key: 'Time in Market % ', group: 'Summary' },
  { key: 'Total Return', group: 'Summary' },
  { key: 'CAGR% (Annual Return)', group: 'Summary' },
  { key: 'Sharpe', group: 'Indicators' },
  { key: 'ROMaD', group: 'Indicators' },
  { key: 'Corr to Benchmark', group: 'Indicators' },
  { key: 'Prob. Sharpe Ratio', group: 'Indicators' },
  { key: 'Smart Sharpe', group: 'Indicators' },
  { key: 'Sortino', group: 'Indicators' },
  { key: 'Smart Sortino', group: 'Indicators' },
  { key: 'Sortino/√2', group: 'Indicators' },
  { key: 'Smart Sortino/√2', group: 'Indicators' },
  { key: 'Omega', group: 'Indicators' },
  { key: '', group: 'Indicators' },
  { key: 'Max Drawdown', group: 'Indicators' },
  { key: 'Longest DD Days', group: 'Indicators' },
  { key: 'Volatility (ann.)', group: 'Indicators' },
  { key: 'R^2', group: 'Indicators' },
  { key: 'Information Ratio', group: 'Indicators' },
  { key: 'Calmar', group: 'Indicators' },
  { key: 'Skew', group: 'Indicators' },
  { key: 'Kurtosis', group: 'Indicators' },
  { key: 'Expected Daily', group: 'Performance' },
  { key: 'Expected Monthly', group: 'Performance' },
  { key: 'Expected Yearly', group: 'Performance' },
  { key: 'Kelly Criterion', group: 'Performance' },
  { key: 'Risk of Ruin', group: 'Performance' },
  { key: 'Daily Value-at-Risk', group: 'Performance' },
  { key: 'Expected Shortfall (cVaR)', group: 'Performance' },
  { key: 'Max Consecutive Wins', group: 'Win/Loss' },
  { key: 'Max Consecutive Losses', group: 'Win/Loss' },
  { key: 'Gain/Pain Ratio', group: 'Win/Loss' },
  { key: 'Gain/Pain (1M)', group: 'Win/Loss' },
  { key: '', group: 'Win/Loss' },
  { key: 'Payoff Ratio', group: 'Win/Loss' },
  { key: 'Profit Factor', group: 'Win/Loss' },
  { key: 'Common Sense Ratio', group: 'Win/Loss' },
  { key: 'CPC Index', group: 'Win/Loss' },
  { key: 'Tail Ratio', group: 'Win/Loss' },
  { key: 'Outlier Win Ratio', group: 'Win/Loss' },
  { key: 'Outlier Loss Ratio', group: 'Win/Loss' },
  { key: 'MTD', group: 'Returns' },
  { key: '3M', group: 'Returns' },
  { key: '6M', group: 'Returns' },
  { key: 'YTD', group: 'Returns' },
  { key: '1Y', group: 'Returns' },
  { key: '3Y (ann.)', group: 'Returns' },
  { key: '5Y (ann.)', group: 'Returns' },
  { key: '10Y (ann.)', group: 'Returns' },
  { key: 'All-time (ann.)', group: 'Returns' },
  { key: 'Best Day', group: 'Best/Worst' },
  { key: 'Worst Day', group: 'Best/Worst' },
  { key: 'Best Month', group: 'Best/Worst' },
  { key: 'Worst Month', group: 'Best/Worst' },
  { key: 'Best Year', group: 'Best/Worst' },
  { key: 'Worst Year', group: 'Best/Worst' },
  { key: 'Avg. Drawdown', group: 'Drawdown' },
  { key: 'Avg. Drawdown Days', group: 'Drawdown' },
  { key: 'Recovery Factor', group: 'Drawdown' },
  { key: 'Ulcer Index', group: 'Drawdown' },
  { key: 'Serenity Index', group: 'Drawdown' },
  { key: 'Avg. Up Month', group: 'Win Rate' },
  { key: 'Avg. Down Month', group: 'Win Rate' },
  { key: 'Win Days', group: 'Win Rate' },
  { key: 'Win Month', group: 'Win Rate' },
  { key: 'Win Quarter', group: 'Win Rate' },
  { key: 'Win Year', group: 'Win Rate' },
  { key: 'Beta', group: 'Correlation' },
  { key: 'Alpha', group: 'Correlation' },
  { key: 'Correlation', group: 'Correlation' },
  { key: 'Treynor Ratio', group: 'Correlation' }
];

export function generateKPMGroup(
  metrics: {
    id: string;
    key: string;
    value: string;
  }[]
) {
  return group(
    metrics.map((metric) => ({
      group: groups.find((item) => item.key === metric.key)?.group ?? '',
      ...metric
    })),
    'key'
  );
}
