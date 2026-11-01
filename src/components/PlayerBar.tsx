import React, { useState, useEffect } from 'react';

interface PlayerBarProps {
  currentTrackTitle?: string;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrackTitle = 'Highway of Dreams',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(45); // seconds
  const [volume, setVolume] = useState<number>(75);
  const totalDuration = 252; // 4:12

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= totalDuration ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const percent = (progress / totalDuration) * 100;

  return (
    <footer className="spotify-player">
      {/* Track Info */}
      <div className="player-track-info">
        <div className="player-cover">⚡</div>
        <div className="player-track-text">
          <div className="player-track-title">{currentTrackTitle}</div>
          <div className="player-track-artist">The Electric Shadows</div>
        </div>
        <button
          className="player-heart"
          onClick={() => setIsLiked(!isLiked)}
          title={isLiked ? 'Удалить из любимых' : 'Добавить в любимые'}
        >
          {isLiked ? '💚' : '🤍'}
        </button>
      </div>

      {/* Main Playback Controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button className="player-btn-icon" title="Случайный порядок">
            🔀
          </button>
          <button
            className="player-btn-icon"
            title="Предыдущий"
            onClick={() => setProgress(0)}
          >
            ⏮
          </button>
          <button
            className="player-btn-play"
            title={isPlaying ? 'Пауза' : 'Воспроизведение'}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            className="player-btn-icon"
            title="Следующий"
            onClick={() => setProgress(0)}
          >
            ⏭
          </button>
          <button className="player-btn-icon" title="Повтор">
            🔁
          </button>
        </div>

        <div className="player-progress-container">
          <span className="player-time">{formatTime(progress)}</span>
          <div
            className="player-progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPct = clickX / rect.width;
              setProgress(Math.floor(newPct * totalDuration));
            }}
          >
            <div
              className="player-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="player-time">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Volume & Aux */}
      <div className="player-volume-controls">
        <span style={{ fontSize: '0.9rem', color: '#b3b3b3' }}>
          {volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider"
          title={`Громкость: ${volume}%`}
        />
      </div>
    </footer>
  );
};
