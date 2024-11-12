'use client';
import { backtestCreateProcess } from '@/api/api-v2';
import { FormDialog } from '@/components/dialog';
import { BacktestForm } from '@/components/forms/backtest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNavItems } from './items';

export function Header() {
  const { setSearch, refresh } = useNavItems();
  const handleSearch = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => setSearch(ev.target.value),
    [setSearch]
  );
  const confirm = useCallback(
    (ref: UseFormReturn<any>) => {
      ref.handleSubmit((data) => {
        backtestCreateProcess(data);
        refresh();
      })();
    },
    [refresh]
  );
  return (
    <div className="flex justify-between">
      <div>
        <Input
          className="w-[300px]"
          placeholder="Search by Alias"
          onChange={handleSearch}
        />
      </div>
      <div>
        <FormDialog
          title="Create Backtest"
          classNames="sm:min-w-[800px]"
          content={BacktestForm}
          confirm={confirm}
        >
          <Button>Create Backtest</Button>
        </FormDialog>
      </div>
    </div>
  );
}
