import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
  name: z.string()
});
export const EditName = forwardRef(
  (
    { name }: { name?: string },
    ref: ForwardedRef<UseFormReturn<{ name: string }>>
  ) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: name ?? ''
      }
    });

    useImperativeHandle(ref, () => form);
    return (
      <Form {...form}>
        <form className="mb-4 space-y-2 [&>div]:grid [&>div]:grid-cols-[60px_1fr] [&>div]:gap-3 [&>div]:space-y-0 [&_label]:text-right">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel>alias</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);
EditName.displayName = 'EditName';
