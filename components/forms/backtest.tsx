'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import {
  ControllerRenderProps,
  useForm,
  UseFormReturn,
  useWatch
} from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  SelectContent,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue
} from '../ui/select';

interface BacktestParams {
  region: string[];
  stock_filter: Record<string, string[]>;
  industry: string[];
  rf: string[];
  strategy: string[];
  position: string[];
  stock_count: number;
  holding_time: string[];
}
const formSchema = z.object({
  region: z.string(),
  stock_filter: z.string(),
  industry: z.array(z.string()),
  rf: z.string(),
  strategy: z.string(),
  position: z.string(),
  stock_count: z.coerce.number(),
  holding_time: z.string()
});

const BacktestForm = forwardRef(
  (
    { data }: { data: BacktestParams },
    ref: ForwardedRef<UseFormReturn<any>>
  ) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        region: data.region[0],
        industry: data.industry
      }
    });
    const region = useWatch({
      control: form.control,
      name: 'region'
    });
    useImperativeHandle(ref, () => form);

    return (
      <Form {...form}>
        <form className="mb-4 space-y-2 [&>div]:grid [&>div]:grid-cols-[180px_1fr] [&>div]:gap-3 [&>div]:space-y-0 [&_label]:text-right">
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Radio field={field} option={data.region} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock_filter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock selection range</FormLabel>
                <FormControl>
                  <Radio
                    field={field}
                    option={data.stock_filter[region] ?? []}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <div>
                    <Check field={field} option={data.industry} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk-free rate of return</FormLabel>
                <FormControl>
                  <Radio field={field} option={data.rf} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock picking strategy</FormLabel>
                <FormControl>
                  <Radio field={field} option={data.strategy} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel>Position Management</FormLabel>
                <FormControl>
                  <Select field={field} option={data.position} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock_count"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel>Number of positions</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="holding_time"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel>Length of holding</FormLabel>
                <FormControl>
                  <Select field={field} option={data.holding_time} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);
BacktestForm.displayName = 'BacktestForm';
export { BacktestForm };

export function BacktestFormDialog({ data }: { data: string }) {
  const ref = useRef<UseFormReturn>(null);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Backtest</Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Backtest</DialogTitle>
        </DialogHeader>
        <BacktestForm data={JSON.parse(data)} ref={ref} />
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              ref.current?.handleSubmit(() => {
                setOpen(false);
              })();
            }}
          >
            Create Backtest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Select({
  placeholder,
  field,
  option
}: {
  placeholder?: string;
  field: ControllerRenderProps<any, string>;
  option: string[];
}) {
  return (
    <SelectPrimitive onValueChange={field.onChange} value={field.value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {option.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive>
  );
}
function Radio({
  field,
  option
}: {
  field: ControllerRenderProps<any, string>;
  option: string[];
}) {
  return (
    <RadioGroup
      className="flex gap-4"
      onValueChange={field.onChange}
      value={field.value}
    >
      {option.map((item) => (
        <FormItem key={item} className="flex items-center space-x-1 space-y-0">
          <FormControl>
            <RadioGroupItem value={item} />
          </FormControl>
          <FormLabel>{item}</FormLabel>
        </FormItem>
      ))}
    </RadioGroup>
  );
}
function Check({
  field,
  option
}: {
  field: ControllerRenderProps<any, string>;
  option: string[];
}) {
  return (
    <>
      {option.map((item) => (
        <FormItem key={item} className="flex items-center space-x-1 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value?.includes(item)}
              onCheckedChange={(checked) => {
                if (checked) {
                  field.onChange([...(field.value ?? []), item]);
                } else {
                  field.onChange(
                    field.value?.filter((i: string) => i !== item) ?? []
                  );
                }
              }}
            />
          </FormControl>
          <FormLabel>{item}</FormLabel>
        </FormItem>
      ))}
    </>
  );
}
