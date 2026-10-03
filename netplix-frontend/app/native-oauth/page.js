'use client';

import { useEffect, useState } from 'react';

const PROVIDERS = new Set(['kakao', 'apple']);

/**
 * SFSafariViewController / Custom Tabs 안에서만 연다.
 * WKWebView 쿠키는 이 브라우저로 넘어오지 않으므로, 여기서 native 쿠키를 심고
 * 같은 호스트의 OAuth 인가 URL 로 넘긴다.
 */
export default function NativeOAuthBridge() {
  const [message, setMessage] = useState('로그인 창을 여는 중…');

  useEffect(() => {
    const provider = new URLSearchParams(window.location.search).get('provider');
    if (!PROVIDERS.has(provider)) {
      setMessage('로그인 화면으로 돌아갑니다.');
      window.location.replace('/login');
      return;
    }
    document.cookie = 'X-App-Platform=native; Path=/; Max-Age=600; SameSite=None; Secure';
    window.location.replace(`/oauth2/authorization/${provider}?platform=native`);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#f5f7ff',
        fontSize: '16px',
      }}
    >
      {message}
    </div>
  );
}
