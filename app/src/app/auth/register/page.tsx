// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

const formSchema = z.object({
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(20, 'Handle must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  bio: z
    .string()
    .min(1, 'Bio is required')
    .max(160, 'Bio must be less than 160 characters'),
  location: z
    .string()
    .max(30, 'Location must be less than 30 characters')
    .optional(),
  position: z
    .string()
    .max(50, 'Position must be less than 50 characters')
    .optional(),
  avatar: z
    .string()
    .min(1, 'Avatar URL is required')
    .url('Must be a valid URL'),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_AVATAR =
  'https://pbs.twimg.com/profile_images/1628134368664293412/yap-rvPy_400x400.jpg';

export default function SignUpPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: '',
      name: '',
      bio: '',
      location: '',
      position: '',
      avatar: DEFAULT_AVATAR,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!address) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to create a profile.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          if (data.error.includes('handle')) {
            form.setError('handle', {
              message: 'This username is already taken',
            });
            throw new Error('This username is already taken');
          }
        }
        throw new Error(data.error || 'Failed to create profile');
      }

      toast({
        title: 'Welcome to Tech Pills! 💊',
        description: 'Your profile has been created successfully.',
      });

      router.push(`/${values.handle}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black px-4 py-10 sm:px-6 pt-[7rem]'>
      <Card className='mx-auto max-w-lg border border-purple-500/20 bg-black/40 backdrop-blur-xl'>
        <CardHeader className='space-y-1'>
          <div className='mb-4 flex items-center justify-center space-x-2'>
            <span className='text-4xl'>💊</span>
            <CardTitle className='bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent'>
              Tech Pills
            </CardTitle>
          </div>
          <CardDescription className='text-center text-zinc-400'>
            {isConnected
              ? 'Fill in your profile details to start sharing tech knowledge'
              : 'Connect your wallet to join the tech community'}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          {error && (
            <Alert
              variant='destructive'
              className='border-red-500/20 bg-red-500/10 text-red-200'
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='handle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-200'>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='techie'
                        {...field}
                        className='border-purple-500/20 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20'
                      />
                    </FormControl>
                    <FormMessage className='text-red-400' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-200'>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        {...field}
                        className='border-purple-500/20 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20'
                      />
                    </FormControl>
                    <FormMessage className='text-red-400' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-200'>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Tell us about yourself and your tech interests...'
                        {...field}
                        className='h-24 resize-none border-purple-500/20 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20'
                      />
                    </FormControl>
                    <FormMessage className='text-red-400' />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='position'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-zinc-200'>Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Software Engineer'
                          {...field}
                          className='border-purple-500/20 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-zinc-200'>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='City, Country'
                          {...field}
                          className='border-purple-500/20 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20'
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-zinc-200'>
                      Profile Picture URL
                    </FormLabel>
                    <FormControl>
                      <div className='flex space-x-2'>
                        <Input
                          {...field}
                          placeholder='https://example.com/avatar.jpg'
                          className='border-purple-500/20 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20'
                        />
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => field.onChange(DEFAULT_AVATAR)}
                          className='shrink-0 border-purple-500/20 bg-zinc-900/50 text-zinc-200 hover:bg-purple-500/20 hover:text-purple-400'
                        >
                          <Camera className='h-4 w-4' />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-400' />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white transition-all duration-200 hover:from-purple-500 hover:to-purple-400'
                disabled={isLoading || !isConnected}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>

              <p className='text-center text-sm text-zinc-400'>
                By signing up, you agree to our{' '}
                <Link
                  href='/terms'
                  className='text-purple-400 transition-colors hover:text-purple-300'
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='text-purple-400 transition-colors hover:text-purple-300'
                >
                  Privacy Policy
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
