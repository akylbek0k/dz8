import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
}) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setErrorMessage('Пожалуйста, введите имя пользователя.');
      return;
    }

    if (!password) {
      setErrorMessage('Пожалуйста, введите пароль.');
      return;
    }

    if (activeTab === 'register') {
      const usernamePattern = /^[\w.@+-]+$/;
      if (!usernamePattern.test(cleanUsername)) {
        setErrorMessage(
          'Имя пользователя может содержать только буквы, цифры и символы @/./+/-/_.'
        );
        return;
      }
      if (cleanUsername.length > 150) {
        setErrorMessage('Имя пользователя не должно превышать 150 символов.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Пароль должен содержать минимум 6 символов.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        await login(cleanUsername, password);
      } else {
        await register(cleanUsername, password);
      }
      onClose();
      setUsername('');
      setPassword('');
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Ошибка выполнения запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚡</span>
            <h3>{activeTab === 'login' ? 'Вход в аккаунт' : 'Регистрация музыканта'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-tabs">
          <div
            className={`modal-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
          >
            Войти
          </div>
          <div
            className={`modal-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
          >
            Регистрация
          </div>
        </div>

        <div className="modal-body">
          {errorMessage && (
            <div className="modal-alert">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Имя пользователя (Логин) <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="например: rocker_2026"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
              {activeTab === 'register' && (
                <div className="form-hint">
                  Буквы, цифры и символы @/./+/-/_. До 150 знаков.
                </div>
              )}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Пароль <span className="req">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#b3b3b3',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? 'Скрыть 🙈' : 'Показать 👁️'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {activeTab === 'register' && (
                <div className="form-hint">Минимум 6 символов</div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
            >
              {isLoading ? (
                <>
                  <div className="spinner-icon" />
                  <span>Обработка...</span>
                </>
              ) : activeTab === 'login' ? (
                'Войти в Spotify Band'
              ) : (
                'Зарегистрироваться и вступить'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#b3b3b3' }}>
            {activeTab === 'login' ? (
              <span>
                Еще нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Зарегистрироваться
                </button>
              </span>
            ) : (
              <span>
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Войти
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
