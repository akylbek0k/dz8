import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../services/api';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (initialTab: 'login' | 'register') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();
  const baseUrl = getApiBaseUrl();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setActiveTab('profile');
    } else {
      onOpenAuth('login');
    }
  };

  return (
    <aside className="spotify-sidebar">
      {/* Brand / Logo */}
      <div className="spotify-logo" onClick={() => setActiveTab('overview')}>
        <svg className="spotify-logo-icon" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.304c-.216.353-.675.467-1.028.25-2.818-1.722-6.365-2.112-10.543-1.157-.402.092-.801-.16-.893-.562-.092-.403.16-.802.562-.894 4.571-1.045 8.492-.598 11.652 1.335.353.217.467.676.25 1.028zm1.468-3.264c-.272.441-.85.58-1.291.309-3.226-1.983-8.144-2.557-11.96-1.399-.499.151-1.026-.134-1.177-.633-.151-.499.134-1.026.633-1.177 4.364-1.324 9.791-.684 13.486 1.589.441.272.58.85.309 1.291zm.126-3.41c-3.868-2.297-10.248-2.509-13.94-1.388-.593.18-1.22-.16-1.4-.753-.18-.593.16-1.22.753-1.4 4.244-1.288 11.284-1.044 15.727 1.593.533.316.708 1.011.392 1.544-.316.533-1.011.708-1.544.392z" />
        </svg>
        <span className="spotify-logo-text">RockBand</span>
        <span className="spotify-logo-badge">PRO</span>
      </div>

      {/* Main Nav */}
      <ul className="spotify-nav-list">
        <li
          className={`spotify-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="nav-icon">🎸</span>
          <span>Главная группа</span>
        </li>
        <li
          className={`spotify-nav-item ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <span className="nav-icon">👥</span>
          <span>Участники бэнда</span>
        </li>
        <li
          className={`spotify-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={handleProfileClick}
        >
          <span className="nav-icon">👤</span>
          <span>Мой профиль</span>
        </li>
      </ul>

      <div className="sidebar-divider" />

      {/* Library / Playlists */}
      <div className="sidebar-library-header">
        <span>ДИСКОГРАФИЯ ГРУППЫ</span>
      </div>

      <div className="sidebar-playlist-list">
        <div
          className="sidebar-playlist-item"
          onClick={() => setActiveTab('overview')}
        >
          <div className="sidebar-album-art">⚡</div>
          <div className="sidebar-playlist-info">
            <h4>Highway of Dreams</h4>
            <p>Альбом • 2026</p>
          </div>
        </div>

        <div
          className="sidebar-playlist-item"
          onClick={() => setActiveTab('overview')}
        >
          <div className="sidebar-album-art">🔥</div>
          <div className="sidebar-playlist-info">
            <h4>Live at Wembley</h4>
            <p>Концертный альбом</p>
          </div>
        </div>

        <div
          className="sidebar-playlist-item"
          onClick={() => setActiveTab('overview')}
        >
          <div className="sidebar-album-art">🌙</div>
          <div className="sidebar-playlist-info">
            <h4>Acoustic Tapes</h4>
            <p>EP • 4 трека</p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div style={{ marginBottom: '6px' }}>
          Бэкенд: <strong>Band Members API</strong>
        </div>
        <a
          href={`${baseUrl}/api/docs/`}
          target="_blank"
          rel="noreferrer"
        >
          📖 Открыть Swagger UI ↗
        </a>
      </div>
    </aside>
  );
};
