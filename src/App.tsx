/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { CareerRecommendationsPage } from './pages/CareerRecommendationsPage';
import { AssistantPage } from './pages/AssistantPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { SettingsPage } from './pages/SettingsPage';

function MainApp() {
  const { currentUser, isDemoUser, isLoading } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const isAuthenticated = Boolean(currentUser || isDemoUser);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
          Loading CareerLens AI...
        </p>
      </div>
    );
  }

  // If not logged in, render public Landing Page
  if (!isAuthenticated && activeTab === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
        <Navbar onOpenAuth={handleOpenAuth} onNavigateTab={handleNavigate} />
        <main className="flex-1">
          <LandingPage onOpenAuth={handleOpenAuth} onNavigateTab={handleNavigate} />
        </main>
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
        <ToastContainer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
        <Navbar onOpenAuth={handleOpenAuth} onNavigateTab={handleNavigate} />
        <main className="flex-1">
          <LandingPage onOpenAuth={handleOpenAuth} onNavigateTab={handleNavigate} />
        </main>
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
        <ToastContainer />
      </div>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-white flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateTab={handleNavigate}
          activeTab={activeTab}
        />

        {/* Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardPage onNavigateTab={handleNavigate} />}
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'resume' && <ResumeAnalyzerPage />}
          {activeTab === 'opportunities' && <OpportunitiesPage />}
          {activeTab === 'skill-gap' && <SkillGapPage />}
          {activeTab === 'recommendations' && <CareerRecommendationsPage />}
          {activeTab === 'assistant' && <AssistantPage />}
          {activeTab === 'saved' && <SavedJobsPage onNavigateTab={handleNavigate} />}
          {activeTab === 'applications' && <ApplicationsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
