import { DialogTrigger } from '@radix-ui/react-dialog';
import {
  cloneElement,
  FunctionComponentElement,
  isValidElement,
  ReactNode,
  RefObject,
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
type HandleSubmit = (fn: (val: any) => void) => void;

interface FormDialogProps<T> {
  children: ReactNode;
  classNames?: string;
  content?: FunctionComponentElement<{
    ref: RefObject<{ handleSubmit: HandleSubmit }>;
  }>;
  onSubmit: (data: T) => void;
}

export function FormDialog<T>({
  children,
  classNames,
  content,
  onSubmit
}: FormDialogProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<{ handleSubmit: HandleSubmit }>(null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={classNames}>
        <DialogHeader>
          <DialogTitle>Create Backtest</DialogTitle>
        </DialogHeader>
        {isValidElement(content) && cloneElement(content, { ref: ref })}
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              ref.current?.handleSubmit(onSubmit);
              setOpen(false);
            }}
          >
            submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
