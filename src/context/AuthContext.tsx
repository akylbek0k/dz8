import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, SpecializationChoiceItem, PatchedProfile } from '../types/api';
import { api } from '../services/api';

interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  specializations: SpecializationChoiceItem[];
  notifications: NotificationItem[];
  login: (username: string, password: string) => Promise<UserProfile>;
  register: (username: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (data: PatchedProfile) => Promise<UserProfile>;
  refreshProfile: () => Promise<void>;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  dismissNotification: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('spotify_band_user_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [specializations, setSpecializations] = useState<SpecializationChoiceItem[]>([
    { value: 'vocals', label: 'Вокал' },
    { value: 'guitar', label: 'Гитара' },
    { value: 'bass', label: 'Бас-гитара' },
    { value: 'drums', label: 'Ударные' },
    { value: 'keys', label: 'Клавишные' },
    { value: 'other', label: 'Другое' },
  ]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const loadSpecializations = useCallback(async () => {
    try {
      const list = await api.getSpecializations();
      if (Array.isArray(list) && list.length > 0) {
        setSpecializations(list);
      }
    } catch (e) {
      console.warn('Не удалось обновить список специализаций:', e);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
      localStorage.setItem('spotify_band_user_cache', JSON.stringify(profile));
    } catch {
      // Not authenticated or session expired
      setUser(null);
      localStorage.removeItem('spotify_band_user_cache');
    }
  }, []);

  // Initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadSpecializations();
        const profile = await api.getProfile();
        if (mounted) {
          setUser(profile);
          localStorage.setItem('spotify_band_user_cache', JSON.stringify(profile));
        }
      } catch {
        if (mounted) {
          // If profile fetch fails, user is guest
          setUser(null);
          localStorage.removeItem('spotify_band_user_cache');
        }
      } finally {
        if (mounted) {
          setIsInitialLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loadSpecializations]);

  const login = async (username: string, password: string): Promise<UserProfile> => {
    try {
      const profile = await api.login({ username, password });
      setUser(profile);
      localStorage.setItem('spotify_band_user_cache', JSON.stringify(profile));
      showNotification('success', `Добро пожаловать в рок-бэнд, ${profile.username}!`);
      return profile;
    } catch (err: unknown) {
      const error = err as Error;
      showNotification('error', error.message || 'Ошибка входа в систему');
      throw err;
    }
  };

  const register = async (username: string, password: string): Promise<UserProfile> => {
    try {
      const profile = await api.register({ username, password });
      setUser(profile);
      localStorage.setItem('spotify_band_user_cache', JSON.stringify(profile));
      showNotification('success', `Регистрация успешна! Музыкант ${profile.username} принят в группу.`);
      return profile;
    } catch (err: unknown) {
      const error = err as Error;
      showNotification('error', error.message || 'Ошибка регистрации');
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.logout();
      showNotification('info', 'Вы успешно вышли из системы');
    } catch (err: unknown) {
      const error = err as Error;
      showNotification('error', error.message || 'Ошибка при выходе');
    } finally {
      setUser(null);
      localStorage.removeItem('spotify_band_user_cache');
    }
  };

  const updateProfile = async (data: PatchedProfile): Promise<UserProfile> => {
    try {
      const updated = await api.updateProfile(data);
      setUser(updated);
      localStorage.setItem('spotify_band_user_cache', JSON.stringify(updated));
      showNotification('success', 'Профиль музыканта успешно обновлен!');
      return updated;
    } catch (err: unknown) {
      const error = err as Error;
      showNotification('error', error.message || 'Не удалось обновить профиль');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitialLoading,
        specializations,
        notifications,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        showNotification,
        dismissNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
