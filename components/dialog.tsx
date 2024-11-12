import { DialogTrigger } from '@radix-ui/react-dialog';
import {
  ClassAttributes,
  ComponentType,
  ReactNode,
  RefAttributes,
  useRef,
  useState
} from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';

type Attr<T> = RefAttributes<T> | ClassAttributes<T>;
type RefType<T> = T extends Attr<infer U> ? U : never;

interface FormDialogProps<T extends Attr<unknown>> {
  title: string;
  children: ReactNode;
  classNames?: string;
  content: ComponentType<T>;
  params?: Omit<T, 'ref'>;
  confirm: (data: RefType<T>) => void | Promise<void>;
}

export function FormDialog<T extends Attr<unknown>>({
  title,
  children,
  classNames,
  content: Content,
  params,
  confirm
}: FormDialogProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<RefType<T>>(null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={classNames}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {Content && <Content {...(params as any)} ref={ref} />}
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              const result = confirm(ref.current!);
              if (result instanceof Promise) {
                result.then(() => setOpen(false));
              } else {
                setOpen(false);
              }
            }}
          >
            submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
