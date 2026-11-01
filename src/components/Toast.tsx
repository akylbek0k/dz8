import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Toast: React.FC = () => {
  const { notifications, dismissNotification } = useAuth();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className={`toast-pill ${n.type}`}>
          <span>
            {n.type === 'success' ? '✓' : n.type === 'error' ? '⚠️' : 'ℹ️'}
          </span>
          <div style={{ flex: 1 }}>{n.message}</div>
          <button
            onClick={() => dismissNotification(n.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
