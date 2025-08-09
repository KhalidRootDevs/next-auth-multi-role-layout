import { z } from 'zod';

export const panelSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required')
});

export type PanelType = z.infer<typeof panelSchema>;

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['employee', 'manager'], {
    required_error: 'Role is required'
  }),
  avatar: z.string().url().optional(),
  initials: z.string().optional(),
  designation: z.string().optional(),
  status: z.enum(['Active', 'On Leave', 'Inactive']).optional(),
  managerId: z.string().optional()
});

export type UserType = z.infer<typeof userSchema>;
