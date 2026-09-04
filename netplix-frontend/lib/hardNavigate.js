/**
 * Capacitor iOS WKWebView 에서는 Next App Router 의 router.push / <Link>
 * (RSC fetch) 가 CapacitorHttp 에 가로채이거나 조용히 실패한다.
 * 로그인 성공 후와 같이 실제 문서 이동(window.location)을 쓴다.
 */
export function markHomeVisited() {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30;
  const isHttps = typeof location !== "undefined" && location.protocol === "https:";
  // iOS WKWebView 는 SameSite=Lax 를 다음 문서 요청에 안 실어 보내는 경우가 있다.
  const sameSite = isHttps ? "None; Secure" : "Lax";
  document.cookie = `visited_home=1; Path=/; Max-Age=${maxAge}; SameSite=${sameSite}`;
}

/** Cursor Simple Browser 등 미리보기 iframe. 여기선 location.assign 이 막히는 경우가 있다. */
export function isEmbeddedPreview() {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function hardNavigate(path) {
  markHomeVisited();
  if (typeof window === "undefined") return;
  const dest = path && String(path).startsWith("/") ? path : `/${path || ""}`;
  const abs = new URL(dest, window.location.href).href;
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.assign(abs);
      return;
    }
  } catch {
    /* cross-origin iframe */
  }
  window.location.assign(dest);
}
