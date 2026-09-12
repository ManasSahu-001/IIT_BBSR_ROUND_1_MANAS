import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext.jsx';
import { useTheme, THEMES } from './contexts/ThemeContext.jsx';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ParticleSporeCanvas from './components/themes/ParticleSporeCanvas.jsx';
import FogCanvas from './components/themes/FogCanvas.jsx';

// Public Pages
import LandingPage from './pages/public/LandingPage.jsx';
import FeaturesPage from './pages/public/FeaturesPage.jsx';
import HowItWorksPage from './pages/public/HowItWorksPage.jsx';
import FAQPage from './pages/public/FAQPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Authenticated Pages
import DashboardPage from './pages/app/DashboardPage.jsx';
import QuestsPage from './pages/app/QuestsPage.jsx';
import CampaignsPage from './pages/app/CampaignsPage.jsx';
import CityCanvasView from './components/city/CityCanvasView.jsx';
import TreasuryView from './components/economy/TreasuryView.jsx';

export default function App() {
  const { user, loading } = useAuth();
  const { theme, isUpsideDown, isHaunted } = useTheme();

  const [activeTab, setActiveTab] = useState('landing');

  // Once auth loaded, route to dashboard if logged in and on landing
  useEffect(() => {
    if (!loading) {
      if (user && (activeTab === 'landing' || activeTab === 'login' || activeTab === 'signup')) {
        setActiveTab('dashboard');
      } else if (!user && ['dashboard', 'quests', 'campaigns', 'city', 'treasury'].includes(activeTab)) {
        setActiveTab('landing');
      }
    }
  }, [user, loading]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center font-mono text-sm text-slate-400 animate-pulse">
          Establishing link to PostgreSQL game server...
        </div>
      );
    }

    switch (activeTab) {
      // Public
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'features':
        return <FeaturesPage setActiveTab={setActiveTab} />;
      case 'how-it-works':
        return <HowItWorksPage setActiveTab={setActiveTab} />;
      case 'faq':
        return <FAQPage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'signup':
        return <RegisterPage setActiveTab={setActiveTab} />;
      
      // App
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'quests':
        return <QuestsPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'city':
        return <CityCanvasView />;
      case 'treasury':
        return <TreasuryView />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-slate-100 overflow-x-hidden">
      
      {/* Dimensional Particle Layer */}
      {isUpsideDown && <ParticleSporeCanvas />}
      {isHaunted && <FogCanvas />}

      {/* Subtle 80s CRT Scanline Layer for Theme H */}
      {isUpsideDown && (
        <div className="crt-overlay fixed inset-0 z-30 opacity-25 pointer-events-none" aria-hidden="true" />
      )}

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {renderContent()}
        </main>

        <Footer setActiveTab={setActiveTab} />
      </div>

    </div>
  );
}
