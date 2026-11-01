import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../services/api';

interface NavbarProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth: (initialTab: 'login' | 'register') => void;
  onOpenBackendSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  setActiveTab,
  onOpenAuth,
  onOpenBackendSettings,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const baseUrl = getApiBaseUrl();

  const getCleanHost = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname;
    } catch {
      return url;
    }
  };

  const getAvatarLetter = () => {
    if (user?.profile?.first_name) {
      return user.profile.first_name[0].toUpperCase();
    }
    return user?.username ? user.username[0].toUpperCase() : 'M';
  };

  return (
    <header className="spotify-topbar">
      <div className="topbar-left">
        <button
          className="topbar-nav-button"
          title="Назад"
          onClick={() => setActiveTab('overview')}
        >
          ‹
        </button>
        <button
          className="topbar-nav-button"
          title="Вперед"
          onClick={() => setActiveTab('members')}
        >
          ›
        </button>

        <div
          className="topbar-api-pill"
          onClick={onOpenBackendSettings}
          title="Нажмите для настройки бэкенда"
        >
          <span className="status-dot" />
          <span>API: {getCleanHost(baseUrl)}</span>
          <span style={{ opacity: 0.6 }}>⚙</span>
        </div>
      </div>

      <div className="topbar-right">
        {isAuthenticated && user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="topbar-user-pill"
              onClick={() => setActiveTab('profile')}
              title="Перейти в мой профиль"
            >
              <div className="user-avatar-circle">{getAvatarLetter()}</div>
              <span className="user-pill-name">{user.profile.first_name || user.username}</span>
              <span className="user-role-tag">
                {user.profile.specialization_display || 'Музыкант'}
              </span>
            </div>

            <button
              className="topbar-auth-btn-ghost"
              onClick={() => logout()}
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <>
            <button
              className="topbar-auth-btn-ghost"
              onClick={() => onOpenAuth('register')}
            >
              Зарегистрироваться
            </button>
            <button
              className="topbar-auth-btn-solid"
              onClick={() => onOpenAuth('login')}
            >
              Войти
            </button>
          </>
        )}
      </div>
    </header>
  );
};
