import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToHash from './components/ScrollToHash.jsx';
import Home from './pages/Home.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import PartnershipPage from './pages/PartnershipPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import EducationPage from './pages/EducationPage.jsx';
import EducationPrograms from './pages/EducationPrograms.jsx';
import EducationProgram from './pages/EducationProgram.jsx';
import EducationSeminars from './pages/EducationSeminars.jsx';
import EducationSeminarsLive from './pages/EducationSeminarsLive.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Topic from './pages/Topic.jsx';
import MyCourse from './pages/MyCourse.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import { usePageSwipe } from './hooks/usePageSwipe.js';

export default function App() {
  // Свайпы по «главным» страницам с тачпада/тача.
  // Хук должен быть вызван внутри роутера (он использует useNavigate).
  usePageSwipe();

  return (
    <div className="relative min-h-screen bg-paper text-ink transition-colors duration-300 dark:bg-ink dark:text-paper">
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/services/partnership" element={<PartnershipPage />} />
          <Route path="/services/premium" element={<PremiumPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/education/seminars" element={<EducationSeminars />} />
          <Route
            path="/education/seminars/free"
            element={
              <ProtectedRoute>
                <EducationSeminarsLive />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/my-courses/:slug"
            element={
              <ProtectedRoute>
                <MyCourse />
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
