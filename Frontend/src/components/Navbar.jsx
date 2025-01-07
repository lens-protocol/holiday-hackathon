import { Link } from 'react-router-dom';
import { ConnectKitButton } from "connectkit";
import {User2Icon, FormInputIcon, ViewIcon, ChartAreaIcon} from 'lucide-react';

export const Navbar = () => (
  <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm fixed w-full z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link to="/" className="text-xl font-bold text-violet-500">
          BookIt
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/events" className="text-gray-300 hover:text-white">
          <ViewIcon/>
            Events
          </Link>
          <Link to="/create" className="text-gray-300 hover:text-white">
          <FormInputIcon/>
            Create Event
          </Link>
          <Link to="/reputation" className="text-gray-300 hover:text-white">
          <ChartAreaIcon/>
            On-chain Reputation
          </Link>
          <Link to="/profile" className="text-gray-300 hover:text-white">
          <User2Icon/>
            Profile
          </Link>
          <ConnectKitButton />
        </div>
      </div>
    </div>
  </nav>
);