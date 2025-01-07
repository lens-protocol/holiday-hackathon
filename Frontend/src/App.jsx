import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from "./components/Web3Provider";
import { Landing } from './components/Landing';
import { Events } from './components/Events';
import { Profile } from './components/Profile';
import { EventForm } from './components/EventForm';
import { Navbar } from './components/Navbar';
import { ReputationDashboard } from './components/ReputationDashboard';

const App = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-background text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/events" element={<Events />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<EventForm />} />
            <Route path="/reputation" element={<ReputationDashboard />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;