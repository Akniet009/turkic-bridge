'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  MessageSquare,
  Building2,
  Package,
  ShieldCheck,
  Check,
  Globe2,
} from 'lucide-react';
import { AppStore } from '@/lib/store';
import { Conversation, Message } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';

function ChatContent() {
  const searchParams = useSearchParams();
  const { language, t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [currentUser] = useState(() => AppStore.getCurrentUser());

  // Input states
  const [messageText, setMessageText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check URL query parameters for supplierId or productId
  useEffect(() => {
    const supplierId = searchParams.get('supplierId');
    const productId = searchParams.get('productId') || undefined;

    let convs = AppStore.getConversations();

    if (supplierId) {
      const conv = AppStore.getOrCreateConversation(currentUser.id, supplierId, productId);
      convs = AppStore.getConversations();
      setActiveConvId(conv.id);
    } else if (convs.length > 0 && !activeConvId) {
      setActiveConvId(convs[0].id);
    }

    setConversations(convs);
  }, [searchParams, currentUser.id, activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || (!messageText.trim() && !attachmentUrl)) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setIsTranslating(true);

    try {
      // Determine recipient's language
      // If current user is buyer (RU or KK), recipient is supplier (TR)
      // If current user is supplier (TR), recipient is buyer (RU or KK)
      const isSupplier = currentUser.role === 'supplier';
      const targetLang = isSupplier ? 'ru' : 'tr';
      const sourceLang = currentUser.language || (isSupplier ? 'tr' : 'ru');

      // Call server route /api/translate
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          sourceLang,
          targetLang,
        }),
      });

      let translatedText = textToSend;
      if (res.ok) {
        const data = await res.json();
        if (data.translatedText) {
          translatedText = data.translatedText;
        }
      }

      AppStore.addMessage(activeConversation.id, {
        sender_id: currentUser.id,
        original_text: textToSend,
        original_lang: sourceLang,
        translated_text: translatedText,
        attachment_url: attachmentUrl || undefined,
      });

      setAttachmentUrl(null);
      setConversations(AppStore.getConversations());
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSamplePhotoAttachment = () => {
    // Demo quick photo attachment
    const samplePhotos = [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    ];
    const chosen = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setAttachmentUrl(chosen);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
      {/* Top bar info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight">
              B2B Чат с автоматическим ИИ-переводом
            </h1>
            <p className="text-[11px] text-slate-500">
              Вы пишете на своем языке — собеседник сразу читает оригинал и перевод с сохранением параметров текстиля.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-600 font-medium">
          <Globe2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Синхронизация TR ⇄ RU ⇄ KK</span>
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-4">
        {/* LEFT COLUMN: Dialogs list */}
        <aside className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
            Диалоги ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((c) => {
              const active = c.id === activeConvId;
              const lastMsg = c.messages?.[c.messages.length - 1];

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    active ? 'bg-white shadow-sm font-semibold' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center shrink-0 font-bold text-sm">
                    {c.supplier?.factory_name[0] || 'T'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {c.supplier?.factory_name}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(lastMsg.created_at).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <span>{c.supplier?.city}</span>
                      {c.product && <span>• {c.product.title_ru.slice(0, 25)}...</span>}
                    </div>

                    {lastMsg && (
                      <p className="text-xs text-slate-600 truncate mt-1">
                        {lastMsg.original_text}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: Active conversation */}
        <main className="md:col-span-8 flex flex-col h-full bg-white">
          {activeConversation ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5 text-brand-navy" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {activeConversation.supplier?.factory_name}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{activeConversation.supplier?.city}, Türkiye</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">Онлайн</span>
                    </div>
                  </div>
                </div>

                {activeConversation.product && (
                  <Link
                    href={`/products/${activeConversation.product.id}`}
                    className="hidden sm:flex items-center gap-2 text-xs font-bold text-brand-navy bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg hover:bg-slate-100"
                  >
                    <Package className="w-3.5 h-3.5 text-brand-accent" />
                    <span className="truncate max-w-[180px]">{activeConversation.product.title_ru}</span>
                  </Link>
                )}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 chat-scroll bg-slate-50/40">
                {activeConversation.messages?.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Начните переписку. Ваше сообщение будет переведено на турецкий язык фабрики.
                  </div>
                )}

                {activeConversation.messages?.map((msg) => {
                  const isMine = msg.sender_id === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xl rounded-2xl p-4 space-y-2 shadow-2xs text-xs ${
                          isMine
                            ? 'bg-slate-900 text-white rounded-br-xs'
                            : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        {/* Optional photo attachment */}
                        {msg.attachment_url && (
                          <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-white/20 mb-2">
                            <Image
                              src={msg.attachment_url}
                              alt="attachment"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Original Text */}
                        <div>
                          <div
                            className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1 ${
                              isMine ? 'text-teal-400' : 'text-slate-400'
                            }`}
                          >
                            <span>Оригинал ({msg.original_lang.toUpperCase()}):</span>
                          </div>
                          <p className="leading-relaxed font-normal text-[13px]">
                            {msg.original_text}
                          </p>
                        </div>

                        {/* AI Translated Text Box */}
                        {msg.translated_text && msg.translated_text !== msg.original_text && (
                          <div
                            className={`pt-2 border-t mt-1 text-[12px] leading-relaxed rounded-lg p-2.5 ${
                              isMine
                                ? 'bg-white/10 border-white/15 text-slate-200'
                                : 'bg-teal-50/70 border-teal-100 text-teal-950 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1 text-teal-500">
                              <Sparkles className="w-3 h-3" />
                              <span>ИИ-перевод:</span>
                            </div>
                            <p>{msg.translated_text}</p>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div
                          className={`text-[9px] text-right ${
                            isMine ? 'text-slate-400' : 'text-slate-400'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTranslating && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-spin" />
                    <span>ИИ переводит сообщение на язык фабрики...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Preview if selected */}
              {attachmentUrl && (
                <div className="p-2 px-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-navy" />
                    <span className="font-semibold text-slate-700">Фото прикреплено к сообщению</span>
                  </div>
                  <button
                    onClick={() => setAttachmentUrl(null)}
                    className="text-rose-600 hover:text-rose-800 font-bold"
                  >
                    Удалить
                  </button>
                </div>
              )}

              {/* Bottom Input Form */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSamplePhotoAttachment}
                  title="Прикрепить образец ткани / фото"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-brand-navy transition-colors shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t.chat.placeholder}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent font-medium"
                />

                <button
                  type="submit"
                  disabled={isTranslating || (!messageText.trim() && !attachmentUrl)}
                  className="py-3 px-5 rounded-xl bg-brand-navy hover:bg-brand-blue disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>{t.chat.send}</span>
                  <Send className="w-3.5 h-3.5 text-brand-accent" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-sm font-semibold">{t.chat.emptyDialog}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Загрузка чата...</div>}>
      <ChatContent />
    </Suspense>
  );
}
