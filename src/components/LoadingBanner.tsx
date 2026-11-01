import React, { useState, useEffect } from 'react';
import { subscribeToLoading } from '../services/api';

interface LoadingBannerProps {
  isInitialLoading?: boolean;
}

export const LoadingBanner: React.FC<LoadingBannerProps> = ({ isInitialLoading = false }) => {
  const [activeRequests, setActiveRequests] = useState<number>(0);
  const [loadingLabel, setLoadingLabel] = useState<string>('Загрузка...');

  useEffect(() => {
    const unsubscribe = subscribeToLoading((count, label) => {
      setActiveRequests(count);
      if (label) {
        setLoadingLabel(label);
      }
    });
    return unsubscribe;
  }, []);

  const isLoading = isInitialLoading || activeRequests > 0;

  if (!isLoading) {
    return null;
  }

  return (
    <>
      <div className="spotify-loading-bar-wrapper">
        <div className="spotify-loading-bar" />
      </div>
      <div className="spotify-loading-pill">
        <div className="spinner-icon" />
        <span>{isInitialLoading ? 'Инициализация рок-бэнда...' : loadingLabel}</span>
      </div>
    </>
  );
};
