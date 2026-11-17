'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Building2, User, Phone, MapPin, ArrowRight, ShieldCheck, ShoppingBag, Factory, Globe } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { BrandLogoMark } from '@/components/ui/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Алматы');
  const [phone, setPhone] = useState('+7 (701) 555-01-23');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'ru' | 'tr' | 'kk'>('ru');
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
    }, 350);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-elevated max-w-lg w-full p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogoMark className="w-12 h-12" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#0B1120]">Регистрация в «Тюркском мосте»</h1>
          <p className="text-xs text-slate-500">
            Прямой оптовый доступ между фабриками Турции и розницей Казахстана
          </p>
        </div>

        {/* Role toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ваша роль на платформе</label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleChange('buyer')}
              className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                role === 'buyer' ? 'bg-white text-[#0B1120] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${role === 'buyer' ? 'text-teal-600' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="leading-tight">Покупатель</div>
                <div className="text-[10px] text-slate-400 font-normal">Казахстан (Магазин)</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('supplier')}
              className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                role === 'supplier' ? 'bg-white text-[#0B1120] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Factory className={`w-4 h-4 ${role === 'supplier' ? 'text-teal-600' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="leading-tight">Поставщик</div>
                <div className="text-[10px] text-slate-400 font-normal">Турция (Фабрика)</div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {role === 'buyer' ? 'Название компании' : 'Название фабрики (TR)'}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={role === 'buyer' ? 'ТОО «Silk Trade»' : 'Denizli Jakar Ltd'}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Контактное лицо</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Айбек Нурланов"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {role === 'buyer' ? 'Город (Казахстан)' : 'Город фабрики (Турция)'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                {role === 'buyer' ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              <label className="block font-semibold text-slate-700 mb-1">Телефон WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (701) 000-00-00"
                  required
                  className="font-mono w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Рабочий Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Пароль</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Основной язык общения</label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ru' | 'tr' | 'kk')}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ru">Русский (язык по умолчанию в РК)</option>
                <option value="tr">Türkçe (ana dil - Türkiye)</option>
                <option value="kk">Қазақ тілі (Қазақстан)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              * ИИ-переводчик автоматически переводит сообщения и спецификации на этот язык
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0B1120] hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Создание профиля...' : 'Зарегистрироваться'}</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </form>

        <div className="bg-[#F9FAFB] border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Турецкие поставщики проходят обязательную проверку сертификатов и инспекцию фабрики модераторами платформы.
          </span>
        </div>

        <div className="text-center text-xs text-slate-500">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-[#0B1120] hover:text-teal-700 font-semibold hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
