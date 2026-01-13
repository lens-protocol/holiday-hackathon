import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppLayout from './layout/AppLayout';
import Landing from './pages/landing/Landing';
import ChallengesList from './pages/challenges/ChallengesList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index
          path="/"
          element={
            <AppLayout>
              <Landing />
            </AppLayout>
          } />
          <Route index
          path='/challenges'
          element={
            <AppLayout>
              <ChallengesList />
            </AppLayout>
          }/>
      </Routes>
    </Router>
  );
};

export default App;
