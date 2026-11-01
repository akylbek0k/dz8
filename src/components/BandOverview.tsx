import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface BandOverviewProps {
  onSelectTrack: (title: string) => void;
  onOpenProfile: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const BandOverview: React.FC<BandOverviewProps> = ({
  onSelectTrack,
  onOpenProfile,
  onOpenAuth,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTrack, setActiveTrack] = useState<number>(1);

  const tracks = [
    { id: 1, title: 'Highway of Dreams (Rock Anthem)', plays: '3 421 800', duration: '4:12', cover: '⚡' },
    { id: 2, title: 'Electric Midnight', plays: '2 190 450', duration: '3:45', cover: '🔥' },
    { id: 3, title: 'Bassline Rebellion', plays: '1 840 200', duration: '4:58', cover: '🎸' },
    { id: 4, title: 'Solo in D Minor (Live)', plays: '1 230 900', duration: '5:20', cover: '🎹' },
    { id: 5, title: 'Encore in the Rain', plays: '980 100', duration: '3:55', cover: '🌧️' },
  ];

  const defaultMembers = [
    {
      role: 'vocals',
      roleLabel: 'Вокал / Фронтмен',
      name: 'Freddie Thorne',
      avatarEmoji: '🎤',
      bio: 'Мощный драйвовый вокал, лидер сцены и автор большинства текстов.',
      fee: '4 500.00 $',
    },
    {
      role: 'guitar',
      roleLabel: 'Соло-гитара',
      name: 'Jimmy Hendrixson',
      avatarEmoji: '🎸',
      bio: 'Виртуозные риффы, взрывные гитарные соло и фузз-эффекты.',
      fee: '4 000.00 $',
    },
    {
      role: 'bass',
      roleLabel: 'Бас-гитара',
      name: 'Cliff Burton Jr.',
      avatarEmoji: '⚡',
      bio: 'Плотный низ, грув и ритмическая опора всего нашего звука.',
      fee: '3 500.00 $',
    },
    {
      role: 'drums',
      roleLabel: 'Ударные',
      name: 'Travis Barkerov',
      avatarEmoji: '🥁',
      bio: 'Бешеная энергетика, двойная педаль и четкий бит на каждом концерте.',
      fee: '3 800.00 $',
    },
    {
      role: 'keys',
      roleLabel: 'Клавишные / Синт',
      name: 'Rick Wakemanov',
      avatarEmoji: '🎹',
      bio: 'Атмосферные аналоговые синты, орган Hammond и электронные текстуры.',
      fee: '3 200.00 $',
    },
  ];

  return (
    <div>
      {/* Artist Hero Banner */}
      <div className="artist-hero">
        <div className="verified-badge">
          <span className="verified-icon">✓</span>
          <span>Подтвержденный рок-бэнд</span>
        </div>
        <h1 className="artist-name">THE ELECTRIC SHADOWS</h1>
        <p className="artist-stats">1 482 910 слушателей за месяц • Лейбл: FishRun Records</p>
      </div>

      {/* Action Bar */}
      <div className="artist-actions-bar">
        <button
          className="btn-play-big"
          onClick={() => {
            onSelectTrack(tracks[0].title);
            setActiveTrack(1);
          }}
          title="Слушать рок-группу"
        >
          ▶
        </button>

        <button
          className="btn-follow"
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? 'В избранном' : 'Подписаться'}
        </button>

        {isAuthenticated ? (
          <button
            className="btn-secondary"
            onClick={onOpenProfile}
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            ✏️ Моя карточка музыканта
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => onOpenAuth('register')}
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            🔥 Вступить в рок-группу
          </button>
        )}

        <button className="btn-dots" title="Дополнительно">
          •••
        </button>
      </div>

      {/* Popular Tracks Section */}
      <section className="content-section">
        <h2 className="section-title">Популярные треки</h2>
        <div className="tracks-table">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="track-row"
              onClick={() => {
                setActiveTrack(track.id);
                onSelectTrack(track.title);
              }}
            >
              <div className="track-number">
                {activeTrack === track.id ? '▶' : track.id}
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  backgroundColor: '#282828',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  marginRight: '14px',
                }}
              >
                {track.cover}
              </div>
              <div className="track-meta">
                <div className={`track-title ${activeTrack === track.id ? 'active' : ''}`}>
                  {track.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  The Electric Shadows • Single
                </div>
              </div>
              <div className="track-plays">{track.plays}</div>
              <div className="track-duration">{track.duration}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Band Members Section */}
      <section className="content-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            Состав группы & Музыканты
          </h2>
          {isAuthenticated ? (
            <button
              className="btn-secondary"
              onClick={onOpenProfile}
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              Редактировать мой профиль ✏️
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => onOpenAuth('login')}
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              Войти как музыкант 🔑
            </button>
          )}
        </div>

        <div className="members-grid">
          {/* If current user is logged in, show their member card at the front! */}
          {isAuthenticated && user && (
            <div className="member-card is-current-user">
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', color: '#1db954', fontWeight: 800 }}>
                ★ ВЫ В ГРУППЕ
              </div>
              <div className={`member-avatar ${user.profile.specialization || 'other'}`}>
                {user.profile.first_name ? user.profile.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
              </div>
              <div className="member-name">
                {user.profile.first_name || user.username}
              </div>
              <div className="member-role">
                {user.profile.specialization_display || 'Музыкант'}
              </div>
              <div className="member-bio">
                {user.profile.bio || 'Действующий участник группы. Профиль активен в системе.'}
              </div>
              <div className="member-fee">
                Ставка: {user.profile.fee ? `${user.profile.fee} $` : 'По договоренности'}
              </div>
              <button
                className="btn-secondary"
                onClick={onOpenProfile}
                style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '0.8rem' }}
              >
                Изменить данные
              </button>
            </div>
          )}

          {defaultMembers.map((m, idx) => (
            <div key={idx} className="member-card">
              <div className={`member-avatar ${m.role}`}>{m.avatarEmoji}</div>
              <div className="member-name">{m.name}</div>
              <div className="member-role">{m.roleLabel}</div>
              <div className="member-bio">{m.bio}</div>
              <div className="member-fee">Ставка: {m.fee}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tour Dates Section */}
      <section className="content-section" style={{ paddingBottom: '60px' }}>
        <h2 className="section-title">Предстоящие концерты тура 2026</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #1db954' }}>
            <div style={{ color: '#1db954', fontWeight: 700, fontSize: '0.85rem' }}>15 НОЯБРЯ 2026</div>
            <h3 style={{ margin: '6px 0', fontSize: '1.1rem' }}>London, UK</h3>
            <p style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>O2 Arena • Electric Tour</p>
          </div>
          <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3d91f4' }}>
            <div style={{ color: '#3d91f4', fontWeight: 700, fontSize: '0.85rem' }}>28 НОЯБРЯ 2026</div>
            <h3 style={{ margin: '6px 0', fontSize: '1.1rem' }}>Berlin, Germany</h3>
            <p style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Mercedes-Benz Arena</p>
          </div>
          <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f15e6c' }}>
            <div style={{ color: '#f15e6c', fontWeight: 700, fontSize: '0.85rem' }}>12 ДЕКАБРЯ 2026</div>
            <h3 style={{ margin: '6px 0', fontSize: '1.1rem' }}>Bishkek, Kyrgyzstan</h3>
            <p style={{ color: '#b3b3b3', fontSize: '0.85rem' }}>Дворец Спорта им. Кожомкула</p>
          </div>
        </div>
      </section>
    </div>
  );
};
