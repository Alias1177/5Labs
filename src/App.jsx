import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToHash from './components/ScrollToHash.jsx';
import Home from './pages/Home.jsx';
import Mentors from './pages/Mentors.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen bg-paper text-ink transition-colors duration-300 dark:bg-ink dark:text-paper">
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Фолбек — всё неизвестное отдаём на 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
