'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/common/logo';

export default function Home() {
  return (
    <main className='flex min-h-screen items-center justify-center text-white'>
      {/* Hero Section */}
      <section className='container relative z-10 mx-auto px-4 pb-20 pt-32'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col gap-6'
          >
            <div className='flex items-center gap-4'>
              <Logo width={80} height={80} />
              <h1 className='bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-5xl font-bold text-transparent lg:text-7xl'>
                Tech Pills
              </h1>
            </div>
            <p className='text-xl leading-relaxed text-gray-300 lg:text-2xl'>
              Whether you&apos;re a curious enthusiast, a tech professional, or
              a builder, Tech Pills offers tailored content to learn, explore,
              and create—all in one place.
            </p>
          </motion.div>

          {/* Right Column - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='grid grid-cols-2 gap-4'
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className='rounded-xl border border-purple-500/20 bg-purple-900/20 p-6 backdrop-blur-sm'
              >
                <feature.icon className='mb-4 h-8 w-8 text-purple-500' />
                <h3 className='mb-2 text-lg font-semibold'>{feature.title}</h3>
                <p className='text-sm text-gray-400'>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Background Elements */}
      <div className='fixed inset-0 -z-10'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(61, 31, 87, 0.8))
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </main>
  );
}

// Features data
const features = [
  {
    title: 'Learn',
    description: 'Access curated tech content and tutorials from experts',
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
      </svg>
    ),
  },
  {
    title: 'Explore',
    description: 'Discover new technologies and trending topics in tech',
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' />
      </svg>
    ),
  },
  {
    title: 'Create',
    description: 'Build and share your own tech projects and experiences',
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path d='M12 4v16m8-8H4' />
      </svg>
    ),
  },
  {
    title: 'Connect',
    description: 'Join a community of tech enthusiasts and professionals',
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
      </svg>
    ),
  },
];
