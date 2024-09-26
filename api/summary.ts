const summary: Record<
  string,
  {
    group: string;
    name: string;
    unit: string;
  }
> = {
  iq_tev_ufcf: {
    group: 'Multiples',
    name: 'TEV/LTM Unlevered FCF',
    unit: ''
  },
  iq_market_cap_lfcf: {
    group: 'Multiples',
    name: 'Market Cap/LTM Levered FCF',
    unit: ''
  },
  iq_pe_normalized: {
    group: 'Multiples',
    name: 'P/LTM Normalized EPS',
    unit: ''
  },
  iq_pe_excl: {
    group: 'Multiples',
    name: 'P/LTM EPS',
    unit: ''
  },
  iq_pbv: {
    group: 'Multiples',
    name: 'P/BV',
    unit: ''
  },
  iq_ptbv: {
    group: 'Multiples',
    name: 'P/Tangible BV',
    unit: ''
  },
  iq_tev_total_rev: {
    group: 'Multiples',
    name: 'TEV/LTM Total Revenue',
    unit: ''
  },
  iq_mktcap_total_rev: {
    group: 'Multiples',
    name: 'Market Cap/LTM Total Revenue',
    unit: ''
  },
  iq_tev_ebitda: {
    group: 'Multiples',
    name: 'TEV/LTM EBITDA',
    unit: ''
  },
  iq_tev_ebit: {
    group: 'Multiples',
    name: 'TEV/LTM EBIT',
    unit: ''
  },
  cash_debt: {
    group: 'Financial Health',
    name: 'Cash & Short Term Investments / Total Debt',
    unit: ''
  },
  ca_debt: {
    group: 'Financial Health',
    name: 'Total Current Assets/Total Debt',
    unit: ''
  },
  debt_ebitda: {
    group: 'Financial Health',
    name: 'Total Debt/EBITDA',
    unit: ''
  },
  iq_total_rev_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'Total Revenue',
    unit: '%'
  },
  iq_gp_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'Gross Profit',
    unit: '%'
  },
  iq_ebitda_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'EBITDA',
    unit: '%'
  },
  iq_earning_co_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'Earnings from Cont. Ops.',
    unit: '%'
  },
  iq_ni_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'Net Income',
    unit: '%'
  },
  iq_ufcf_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'Unlevered Free Cash Flow',
    unit: '%'
  },
  iq_dps_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'Dividend per Share',
    unit: '%'
  },
  iq_lfcf_1yr_ann_growth: {
    group: 'Growth Over Prior Year',
    name: 'Levered Free Cash Flow',
    unit: '%'
  },
  ret_1m: {
    group: 'Returns',
    name: '1月涨幅',
    unit: '%'
  },
  ret_3m: {
    group: 'Returns',
    name: '3月涨幅',
    unit: '%'
  },
  ret_6m: {
    group: 'Returns',
    name: '6月涨幅',
    unit: '%'
  },
  iq_return_equity: {
    group: 'Returns',
    name: 'Return on Equity',
    unit: '%'
  },
  iq_return_assets: {
    group: 'Returns',
    name: 'Return on Assets',
    unit: '%'
  },
  iq_return_capital: {
    group: 'Returns',
    name: 'Return on Capital',
    unit: '%'
  },
  iq_gross_margin: {
    group: 'Margin Analysis',
    name: 'Gross Margin',
    unit: '%'
  },
  iq_sga_margin: {
    group: 'Margin Analysis',
    name: 'SG&A Margin',
    unit: '%'
  },
  iq_ebitda_margin: {
    group: 'Margin Analysis',
    name: 'EBITDA Margin',
    unit: '%'
  },
  iq_ebit_margin: {
    group: 'Margin Analysis',
    name: 'EBIT Margin',
    unit: '%'
  },
  iq_earining_co_margin: {
    group: 'Margin Analysis',
    name: 'Earnings from Cont. Ops Margin',
    unit: '%'
  },
  iq_ni_margin: {
    group: 'Margin Analysis',
    name: 'Net Income Margin',
    unit: '%'
  },
  iq_lfcf_margin: {
    group: 'Margin Analysis',
    name: 'Levered Free Cash Flow Margin',
    unit: '%'
  },
  iq_ufcf_margin: {
    group: 'Margin Analysis',
    name: 'Unlevered Free Cash Flow Margin',
    unit: '%'
  },
  dy_mktcap: {
    group: 'Dividends',
    name: 'Dividend/Market Cap',
    unit: '%'
  },
  by_mktcap: {
    group: 'Dividends',
    name: 'Buy Back/Market Cap',
    unit: '%'
  },
  sy_tev: {
    group: 'Dividends',
    name: '(Dividend+BuyBack）/TEV',
    unit: '%'
  },
  cash_mktcap: {
    group: 'Dividends',
    name: 'Free Cash/Market Cap',
    unit: '%'
  },
  cash_tev: {
    group: 'Dividends',
    name: 'Free Cash/TEV',
    unit: '%'
  }
};

const sort = [
  'Multiples',
  'Financial Health',
  'Growth Over Prior Year',
  'Dividends',
  'Margin Analysis',
  'Returns'
];

export function generateSummary(s: { key: string; value: number }[]) {
  const result = Map.groupBy(
    s.map((i) => {
      const { group, name } = summary[i.key];
      return {
        group,
        name,
        value: i.value.toFixed(2) + ' %'
      };
    }),
    (d) => d.group
  );
  return sort.map((i) => [i, result.get(i)!] as const);
}
