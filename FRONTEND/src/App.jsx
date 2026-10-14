import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { Privacy } from './pages/Privacy';
import { Dashboard } from './pages/Dashboard';
import { CasesList } from './pages/CasesList';
import { NewCase } from './pages/NewCase';
import { CaseDetail } from './pages/CaseDetail';
import { MyFiles } from './pages/MyFiles';
import { SmartSearch } from './pages/SmartSearch';
import { SavedContent } from './pages/SavedContent';
import { Settings } from './pages/Settings';
import { LearnHub } from './pages/LearnHub';
import { MultimodalAI } from './pages/MultimodalAI';
import { OmniMind } from './pages/OmniMind';
import { AssistantPage } from './pages/AssistantPage';
import { ChatPage } from './pages/ChatPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { TranslatePage } from './pages/TranslatePage';
import { VoiceTranslatorPage } from './pages/VoiceTranslatorPage';
import { TranscribePage } from './pages/TranscribePage';
import { UnifiedHistory } from './pages/UnifiedHistory';
import { NotFound } from './pages/NotFound';

import { ServerStatusBanner } from './components/ServerStatusBanner';
import { MultimodalChatbot } from './components/MultimodalChatbot';

function AppLayout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/signup', '/forgot-password', '/verify-email'].includes(location.pathname);
  const isPublicPage = isAuthPage || ['/', '/privacy', '/multimodal-ai'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col font-sans selection:bg-teal-500/30 selection:text-white">
      {/* Top Server Waking Status Banner */}
      {!isAuthPage && <ServerStatusBanner />}

      {/* Top Navbar – always visible except on login/register/auth screens */}
      {!isAuthPage && <Navbar />}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – only on protected (non-public) pages */}
        {!isPublicPage && <Sidebar />}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${!isPublicPage ? 'pb-20 md:pb-0' : ''}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/multimodal-ai" element={<MultimodalAI />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
            <Route path="/translate" element={<TranslatePage />} />
            <Route path="/voice-translator" element={<VoiceTranslatorPage />} />
            <Route path="/transcribe" element={<TranscribePage />} />
            <Route path="/omnimind" element={<OmniMind />} />
            <Route path="/workspace" element={<OmniMind />} />
            <Route path="/workspace/:id" element={<OmniMind />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><UnifiedHistory /></ProtectedRoute>} />
            <Route path="/cases" element={<ProtectedRoute><CasesList /></ProtectedRoute>} />
            <Route path="/cases/new" element={<ProtectedRoute><NewCase /></ProtectedRoute>} />
            <Route path="/cases/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
            <Route path="/files" element={<ProtectedRoute><MyFiles /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SmartSearch /></ProtectedRoute>} />
            <Route path="/saved-content" element={<ProtectedRoute><SavedContent /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><LearnHub /></ProtectedRoute>} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Footer – visible on public pages and inside authenticated area */}
          {!isAuthPage && <Footer />}
        </main>
      </div>

      {/* Floating Multimodal AI Chatbot & Voice Assistant Widget */}
      {!isAuthPage && location.pathname !== '/assistant' && <MultimodalChatbot />}

      {/* Bottom tab bar (mobile only, authenticated pages) */}
      {!isPublicPage && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <Router>
              <AppLayout />
            </Router>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
