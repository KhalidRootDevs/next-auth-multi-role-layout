'use client';

import InputField from '@/components/custom/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { userSchema, UserType } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

export default function UserForm({
  user,
  managers = []
}: {
  managers?: { id: string; name: string }[];
  user?: UserType | null;
}) {
  const form = useForm<UserType>({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      name: '',
      email: '',
      role: 'employee',
      avatar: '',
      initials: '',
      designation: '',
      status: 'Active',
      managerId: ''
    }
  });

  const role = useWatch({ control: form.control, name: 'role' });

  const onSubmit = (data: UserType) => {
    console.log(data);
    // Send to backend
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <InputField name="name" type="text" label="Full Name" />
        <InputField name="email" type="email" label="Email Address" />

        <InputField
          name="role"
          type="select"
          label="Role"
          options={[
            { value: 'employee', label: 'Employee' },
            { value: 'manager', label: 'Manager' }
          ]}
        />

        <InputField name="designation" type="text" label="Designation" />

        <InputField
          name="status"
          type="select"
          label="Employment Status"
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'On Leave', label: 'On Leave' },
            { value: 'Inactive', label: 'Inactive' }
          ]}
        />

        {role === 'employee' && (
          <InputField
            name="managerId"
            type="select"
            label="Manager"
            options={managers.map((mgr) => ({
              value: mgr.id,
              label: mgr.name
            }))}
          />
        )}

        <InputField name="avatar" type="text" label="Avatar URL (optional)" />
        <InputField name="initials" type="text" label="Initials (optional)" />

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
