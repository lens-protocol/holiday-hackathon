export default function Loading() {
  return (
    <div className='animate-pulse'>
      <div className='flex flex-col items-center space-y-4'>
        <div className='h-32 w-32 rounded-full bg-gray-700' />
        <div className='h-6 w-48 rounded bg-gray-700' />
        <div className='h-4 w-32 rounded bg-gray-700' />
      </div>
    </div>
  );
}
