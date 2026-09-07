'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MapPin } from 'lucide-react';
import {
  bindLocationNoticePresenter,
  ensureLocationAccessConsent,
  getLocationNoticeState,
  setLocationNoticeState,
} from '@/lib/locationAccessNotice';

/**
 * 위치(선택) 접근권한 사전 고지. OS 권한 창보다 먼저 뜨며,
 * 거부해도 다른 기능은 쓸 수 있다. (정보통신망법 제22조의2)
 */
export default function LocationAccessNotice() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const [resolver, setResolver] = useState(null);

  const isAuthRoute =
    pathname === '/login' || pathname === '/signup' || pathname.startsWith('/login/');

  const present = useCallback(() => {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (getLocationNoticeState() === 'accepted') return Promise.resolve(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
      setOpen(true);
    });
  }, []);

  useEffect(() => bindLocationNoticePresenter(present), [present]);

  useEffect(() => {
    if (isAuthRoute) return;
    if (getLocationNoticeState()) return;
    const t = setTimeout(() => {
      ensureLocationAccessConsent().catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [isAuthRoute]);

  const finish = (accepted) => {
    setLocationNoticeState(accepted ? 'accepted' : 'declined');
    setOpen(false);
    const r = resolver;
    setResolver(null);
    if (r) r(accepted);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loc-notice-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'rgba(8, 10, 16, 0.92)',
      }}
    >
      <div
        style={{
          width: 'min(440px, 100%)',
          borderRadius: 20,
          padding: '26px 22px 20px',
          background: 'linear-gradient(165deg, #1a1524, #121018)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          color: '#fff',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(251, 191, 36, 0.16)',
            }}
          >
            <MapPin size={28} color="#fbbf24" />
          </div>
        </div>
        <h1 id="loc-notice-title" style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', margin: '0 0 8px' }}>
          접근권한 안내
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', textAlign: 'center', margin: '0 0 16px' }}>
          주변 장소를 보여 주기 전에, 선택 권한과 이용 목적을 알려 드립니다.
        </p>
        <div
          style={{
            borderRadius: 14,
            padding: '14px 14px 12px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: 14,
          }}
        >
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#fbbf24' }}>선택적 접근권한</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>위치</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)' }}>
            가까운 DVD 매장, 웰니스·캠핑, 오디오 가이드, 날씨 등 주변 정보를 제공할 때 사용합니다.
            동의하지 않아도 검색·둘러보기 등 다른 기능은 그대로 이용할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => finish(true)}
          style={{
            width: '100%',
            height: 50,
            border: 'none',
            borderRadius: 14,
            fontWeight: 800,
            fontSize: 16,
            color: '#1a1204',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          }}
        >
          동의
        </button>
        <button
          type="button"
          onClick={() => finish(false)}
          style={{
            width: '100%',
            marginTop: 10,
            height: 44,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.88)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          동의하지 않음
        </button>
      </div>
    </div>
  );
}
