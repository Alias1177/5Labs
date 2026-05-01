import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToHash from './components/ScrollToHash.jsx';
import Home from './pages/Home.jsx';
import AboutPage from './pages/AboutPage.jsx';
import PartnershipPage from './pages/PartnershipPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import EducationPage from './pages/EducationPage.jsx';
import EducationPrograms from './pages/EducationPrograms.jsx';
import EducationProgram from './pages/EducationProgram.jsx';
import EducationSeminars from './pages/EducationSeminars.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Topic from './pages/Topic.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen bg-paper text-ink transition-colors duration-300 dark:bg-ink dark:text-paper">
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services/partnership" element={<PartnershipPage />} />
          <Route path="/services/premium" element={<PremiumPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/education/seminars" element={<EducationSeminars />} />
          <Route path="/education/individual" element={<EducationPrograms format="individual" />} />
          <Route path="/education/group" element={<EducationPrograms format="group" />} />
          <Route path="/education/programs/:slug" element={<EducationProgram />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/:slug" element={<Topic />} />
          {/* Фолбек — всё неизвестное отдаём на 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
