import React, { useState } from 'react';
import { getApiBaseUrl, setApiBaseUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BackendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendSettingsModal: React.FC<BackendSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showNotification, refreshProfile } = useAuth();
  const [url, setUrl] = useState<string>(getApiBaseUrl());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiBaseUrl(url);
    showNotification('success', `API URL сохранен: ${url}`);
    refreshProfile();
    onClose();
  };

  const handleReset = () => {
    const defaultUrl = 'https://inai-col2.fishrungames.com';
    setUrl(defaultUrl);
    setApiBaseUrl(defaultUrl);
    setTestResult(null);
    showNotification('info', 'Восстановлен адрес API по умолчанию');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const cleanUrl = url.trim().replace(/\/+$/, '');
      const resp = await fetch(`${cleanUrl}/api/specializations/`, {
        method: 'GET',
      });
      if (resp.ok) {
        const data = await resp.json();
        setTestResult({
          ok: true,
          message: `Соединение успешно! Загружено ${data.length} специализаций.`,
        });
      } else {
        setTestResult({
          ok: false,
          message: `Сервер ответил ошибкой: ${resp.status} ${resp.statusText}`,
        });
      }
    } catch (e) {
      const err = e as Error;
      setTestResult({
        ok: false,
        message: `Ошибка подключения: ${err.message || 'Сервер недоступен'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚙️</span>
            <h3>Настройка API Бэкенда</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#b3b3b3', fontSize: '0.88rem', marginBottom: '20px', lineHeight: 1.5 }}>
            Здесь можно указать URL бэкенда для сдачи домашнего задания, если преподаватель предоставит новый хост.
          </p>

          <div className="form-group">
            <label className="form-label">API Base URL</label>
            <input
              type="text"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://inai-col2.fishrungames.com"
            />
            <div className="form-hint">
              По умолчанию: <code>https://inai-col2.fishrungames.com</code>
            </div>
          </div>

          {testResult && (
            <div
              className="modal-alert"
              style={{
                borderColor: testResult.ok ? '#1db954' : '#f15e6c',
                backgroundColor: testResult.ok ? 'rgba(29, 185, 84, 0.15)' : 'rgba(241, 94, 108, 0.15)',
                color: testResult.ok ? '#1db954' : '#ff9ca6',
              }}
            >
              {testResult.ok ? '✓ ' : '⚠️ '}
              {testResult.message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleTestConnection}
              disabled={isTesting}
              style={{ fontSize: '0.85rem' }}
            >
              {isTesting ? 'Проверка...' : '🔍 Проверить связь'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              style={{ fontSize: '0.85rem' }}
            >
              Сброс по умолчанию
            </button>
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="button" className="btn-primary" onClick={handleSave}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
