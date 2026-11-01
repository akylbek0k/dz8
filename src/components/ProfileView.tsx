import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SpecializationEnum } from '../types/api';

interface ProfileViewProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAuth }) => {
  const {
    user,
    isAuthenticated,
    specializations,
    updateProfile,
    logout,
    refreshProfile,
  } = useAuth();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [specialization, setSpecialization] = useState<SpecializationEnum>('other');
  const [bio, setBio] = useState<string>('');
  const [fee, setFee] = useState<string>('0.00');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state whenever user data changes
  useEffect(() => {
    if (user?.profile) {
      setFirstName(user.profile.first_name || '');
      setSpecialization((user.profile.specialization as SpecializationEnum) || 'other');
      setBio(user.profile.bio || '');
      setFee(user.profile.fee || '0.00');
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="profile-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>
            Профиль музыканта закрыт
          </h2>
          <p style={{ color: '#b3b3b3', marginBottom: '24px', lineHeight: 1.5 }}>
            Чтобы просматривать и редактировать свой профиль, управлять своей ставкой и специализацией в группе, пожалуйста, войдите в систему или создайте новый аккаунт.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => onOpenAuth('login')}>
              Войти в систему
            </button>
            <button className="btn-secondary" onClick={() => onOpenAuth('register')}>
              Регистрация
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate fee format (^-?\d{0,8}(?:\.\d{0,2})?$)
    const feeRegex = /^-?\d{0,8}(?:\.\d{0,2})?$/;
    const cleanFee = fee.trim();
    if (cleanFee && !feeRegex.test(cleanFee)) {
      setValidationError('Неверный формат ставки. Пример: 5000 или 3500.50 (до 8 цифр и 2 знака после точки).');
      return;
    }

    // Validate first_name length
    if (firstName.length > 100) {
      setValidationError('Имя не должно превышать 100 символов.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        first_name: firstName.trim(),
        specialization,
        bio: bio.trim(),
        fee: cleanFee || '0.00',
      });
      setIsEditing(false);
    } catch {
      // Error is handled via showNotification in context
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user?.profile) {
      setFirstName(user.profile.first_name || '');
      setSpecialization((user.profile.specialization as SpecializationEnum) || 'other');
      setBio(user.profile.bio || '');
      setFee(user.profile.fee || '0.00');
    }
    setValidationError(null);
    setIsEditing(false);
  };

  const avatarLetter = firstName ? firstName[0].toUpperCase() : user.username[0].toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Banner */}
        <div className="profile-header-banner">
          <div className={`profile-avatar-large ${specialization || 'other'}`}>
            {avatarLetter}
          </div>
          <div className="profile-meta" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2>{user.profile.first_name || user.username}</h2>
              <span className="user-role-tag">
                {user.profile.specialization_display || 'Музыкант'}
              </span>
            </div>
            <p>
              Логин: <strong>@{user.username}</strong> • ID: #{user.id}
            </p>
          </div>
          <div>
            {!isEditing ? (
              <button
                className="btn-primary"
                onClick={() => setIsEditing(true)}
                style={{ fontSize: '0.85rem', padding: '10px 20px' }}
              >
                ✏️ Редактировать
              </button>
            ) : (
              <button
                className="btn-secondary"
                onClick={handleCancel}
                style={{ fontSize: '0.85rem', padding: '10px 20px' }}
              >
                Отмена
              </button>
            )}
          </div>
        </div>

        {validationError && (
          <div className="modal-alert">
            ⚠️ {validationError}
          </div>
        )}

        {/* Profile Content / Form */}
        <form onSubmit={handleSave}>
          <div className="form-row">
            {/* Username (Read Only) */}
            <div className="form-group">
              <label className="form-label">
                Имя пользователя (Логин)
              </label>
              <input
                type="text"
                className="form-input"
                value={user.username}
                disabled
              />
              <div className="form-hint">Логин задается при регистрации и неизменен</div>
            </div>

            {/* First Name (Editable) */}
            <div className="form-group">
              <label className="form-label">
                Имя музыканта {isEditing && <span className="req">*</span>}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Например: Freddie Mercury"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={100}
                disabled={!isEditing}
              />
              <div className="form-hint">До 100 символов</div>
            </div>
          </div>

          <div className="form-row">
            {/* Specialization (Dynamic Select) */}
            <div className="form-group">
              <label className="form-label">
                Специализация в группе
              </label>
              {isEditing ? (
                <select
                  className="form-select"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value as SpecializationEnum)}
                >
                  {specializations.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  value={user.profile.specialization_display || 'Другое'}
                  disabled
                />
              )}
              <div className="form-hint">Загружается из API (/api/specializations/)</div>
            </div>

            {/* Fee */}
            <div className="form-group">
              <label className="form-label">
                Гонорар / Ставка за выступление ($)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="0.00"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                disabled={!isEditing}
              />
              <div className="form-hint">Формат: десятичное число (например: 5000.00)</div>
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">
              Биография и опыт
            </label>
            <textarea
              className="form-textarea"
              placeholder="Расскажите о своем музыкальном опыте, инструментах, любимых треках..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
            />
            <div className="form-hint">Краткое описание для карточки в составе рок-группы</div>
          </div>

          {/* Actions */}
          <div className="form-actions" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => refreshProfile()}
                title="Обновить профиль с сервера"
                style={{ fontSize: '0.85rem' }}
              >
                🔄 Обновить
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => logout()}
                style={{ fontSize: '0.85rem', borderColor: '#f15e6c', color: '#ff9ca6' }}
              >
                🚪 Выйти из системы
              </button>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
