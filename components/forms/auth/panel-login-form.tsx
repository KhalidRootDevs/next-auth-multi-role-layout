'use client';

import InputField from '@/components/custom/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { panelSchema, type PanelType } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function PanelLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const form = useForm<PanelType>({
    resolver: zodResolver(panelSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: PanelType) {
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password
      });

      if (res?.ok && !res.error) {
        toast.success('Login successful. Welcome back!');
        router.push('/dashboard');
        router.refresh();
      } else {
        let errorMessage = 'Invalid credentials. Please try again.';

        if (res?.error) {
          switch (res.error) {
            case 'CredentialsSignin':
              errorMessage =
                'Invalid email or password. Please check your credentials.';
              break;
            case 'Unable to connect to server':
              errorMessage =
                'Unable to connect to server. Please try again later.';
              break;
            case 'Authentication failed':
              errorMessage =
                'Authentication failed. Please check your credentials.';
              break;
            default:
              errorMessage = res.error;
          }
        }

        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          Panel Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your panel credentials to access the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            <InputField
              name="email"
              type="email"
              label="Email Address"
              placeholder="panel@example.com"
            />

            <InputField
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
            />

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
