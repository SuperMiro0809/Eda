import { FormProvider as Form, UseFormReturn, FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

type FormProviderProps<T extends FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function FormProvider<T extends FieldValues>({
  children,
  onSubmit,
  methods,
}: FormProviderProps<T>) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
