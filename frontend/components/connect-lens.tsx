'use client';

// import { useLens } from '../contexts/LensContext';

export default function ConnectLens() {
  // const { isAuthenticated, connect } = useLens();

  // if (isAuthenticated) {
  //   return null;
  // }

  return (
    <button
      // onClick={connect}
      className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Connect to Lens
    </button>
  );
}
