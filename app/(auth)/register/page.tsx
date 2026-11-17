'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Building2, User, Phone, MapPin, ArrowRight, ShieldCheck, ShoppingBag, Factory, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { AppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState(role === 'buyer' ? 'Алматы' : 'Денизли');
  const [phone, setPhone] = useState(role === 'buyer' ? '+7 (701) 555-01-23' : '+90 (258) 299-12-34');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'ru' | 'tr' | 'kk'>(role === 'buyer' ? 'ru' : 'tr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (newRole: 'buyer' | 'supplier') => {
    setRole(newRole);
    if (newRole === 'buyer') {
      setCity('Алматы');
      setPhone('+7 (701) ');
      setLanguage('ru');
    } else {
      setCity('Денизли');
      setPhone('+90 (258) ');
      setLanguage('tr');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const country = role === 'buyer' ? 'Казахстан' : 'Турция';
    const newProfile = {
      id: `usr-${Date.now()}`,
      role: role as UserRole,
      name: name || (role === 'buyer' ? 'Новый покупатель' : 'Представитель фабрики'),
      company: company || (role === 'buyer' ? 'ТОО Silk Trade KZ' : 'Tekstil Sanayi Ltd'),
      phone: phone || '+7 700 000 00 00',
      country,
      city: city || (role === 'buyer' ? 'Алматы' : 'Денизли'),
      language,
    };

    // Save active profile in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('tb_current_profile', JSON.stringify(newProfile));
      localStorage.setItem('tb_current_role', role);
      window.dispatchEvent(new Event('tb_user_change'));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'supplier') {
        router.push('/dashboard/supplier');
      } else {
        router.push('/catalog');
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-navy text-brand-accent flex items-center justify-center font-extrabold text-xl mx-auto">
            TB
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Регистрация в «Тюркском мосте»</h1>
          <p className="text-xs text-slate-500">
            Прямой оптовый доступ между фабриками Турции и розницей Казахстана
          </p>
        </div>

        {/* Role toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Ваша роль на платформе</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => handleRoleChange('buyer')}
              className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                role === 'buyer'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-brand-accent" />
              <div className="text-left">
                <div className="leading-tight">Покупатель</div>
                <div className="text-[10px] text-slate-400 font-normal">Казахстан (Магазин/Сеть)</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('supplier')}
              className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                role === 'supplier'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Factory className="w-4 h-4 text-brand-accent" />
              <div className="text-left">
                <div className="leading-tight">Поставщик</div>
                <div className="text-[10px] text-slate-400 font-normal">Турция (Производитель)</div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {role === 'buyer' ? 'Название компании / Магазина' : 'Название фабрики (Турция)'}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={role === 'buyer' ? 'ТОО «Silk Trade»' : 'Denizli Jakar Ltd'}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Контактное лицо</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Айбек Нурланов"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {role === 'buyer' ? 'Город (Казахстан)' : 'Город фабрики (Турция)'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                {role === 'buyer' ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    <option value="Алматы">Алматы</option>
                    <option value="Астана">Астана</option>
                    <option value="Шымкент">Шымкент</option>
                    <option value="Караганда">Караганда</option>
                    <option value="Актобе">Актобе</option>
                  </select>
                ) : (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    <option value="Денизли">Денизли (Текстильный кластер)</option>
                    <option value="Бурса">Бурса (Шёлк и жаккард)</option>
                    <option value="Стамбул">Стамбул (Торговый хаб)</option>
                    <option value="Газиантеп">Газиантеп</option>
                    <option value="Измир">Измир</option>
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Телефон WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (701) 000-00-00"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Рабочий Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Пароль</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Основной язык общения</label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="ru">Русский (язык по умолчанию в РК)</option>
                <option value="tr">Türkçe (ana dil - Türkiye)</option>
                <option value="kk">Қазақ тілі (Қазақстан)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              * Встроенный ИИ-переводчик автоматически переводит сообщения и спецификации на этот язык
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-navy hover:bg-slate-800 text-brand-accent font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Создание профиля...' : 'Зарегистрироваться'}</span>
              <ArrowRight className="w-4 h-4 text-brand-accent" />
            </button>
          </div>
        </form>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>
            Турецкие поставщики проходят обязательную проверку сертификатов и инспекцию фабрики модераторами платформы.
          </span>
        </div>

        <div className="text-center text-xs text-slate-500">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-brand-navy font-bold hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
