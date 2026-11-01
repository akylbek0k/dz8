import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingBanner } from './components/LoadingBanner';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PlayerBar } from './components/PlayerBar';
import { BandOverview } from './components/BandOverview';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { BackendSettingsModal } from './components/BackendSettingsModal';
import { Toast } from './components/Toast';
import './styles/spotify.css';

const MainLayout: React.FC = () => {
  const { isInitialLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentTrack, setCurrentTrack] = useState<string>('Highway of Dreams (Rock Anthem)');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [isBackendSettingsOpen, setIsBackendSettingsOpen] = useState<boolean>(false);

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <div className="spotify-app">
      {/* Network Activity Banner ("Плашка загрузки") */}
      <LoadingBanner isInitialLoading={isInitialLoading} />

      {/* Main Workspace Pane */}
      <div className="spotify-main-wrapper">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={handleOpenAuth}
        />

        {/* Scrollable Center Content */}
        <main className="spotify-content">
          <Navbar
            setActiveTab={setActiveTab}
            onOpenAuth={handleOpenAuth}
            onOpenBackendSettings={() => setIsBackendSettingsOpen(true)}
          />

          <div style={{ flex: 1 }}>
            {activeTab === 'profile' ? (
              <ProfileView onOpenAuth={handleOpenAuth} />
            ) : (
              <BandOverview
                onSelectTrack={(title) => setCurrentTrack(title)}
                onOpenProfile={() => setActiveTab('profile')}
                onOpenAuth={handleOpenAuth}
              />
            )}
          </div>
        </main>
      </div>

      {/* Bottom Fixed Spotify Player Bar */}
      <PlayerBar currentTrackTitle={currentTrack} />

      {/* Dialogs & Overlays */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthOpen(false)}
      />

      <BackendSettingsModal
        isOpen={isBackendSettingsOpen}
        onClose={() => setIsBackendSettingsOpen(false)}
      />

      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
