/**
 * movie there 전용 API.
 * 화면(capacitor server.url)과 로그인·회원가입·OAuth 가 같은 Heroku 앱을 쓴다.
 * 예전 touraz-dvdholic 호스트로는 보내지 않는다.
 *
 * 웹뷰가 이미 이 호스트이면 상대 경로를 쓴다. 절대 URL 로 바꾸면
 * CapacitorHttp 가 외부 요청으로 가로채 모바일에서만 응답이 깨진다.
 */
import { Capacitor } from "@capacitor/core";

const HEROKU_API_URL = "https://movie-there-290fdbcabcb3.herokuapp.com";
const HEROKU_API_HOST = "movie-there-290fdbcabcb3.herokuapp.com";

function isNativeCapacitor() {
  try {
    return Capacitor?.isNativePlatform?.() === true;
  } catch {
    return false;
  }
}

function pageOriginHostMatchesHeroku() {
  if (typeof window === "undefined") return false;
  const host = (window.location?.host || "").toLowerCase();
  return host === HEROKU_API_HOST;
}

export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    const env = process.env.NEXT_PUBLIC_API_URL;
    return env && env !== "" ? env : "";
  }
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env && env !== "") return env;

  // 1) Capacitor 네이티브이지만 server.url 로 Heroku 페이지 자체를 띄운 경우 →
  //    page origin === HEROKU_API_URL 이므로 상대 경로(same-origin XHR)가 가장 안정.
  //    웹 빌드와 동일한 응답 경로를 타게 되어 모바일에서만 깨지는 케이스를 줄인다.
  if (isNativeCapacitor() && pageOriginHostMatchesHeroku()) {
    return "";
  }

  // 2) Capacitor 네이티브에서 page origin 이 capacitor://, file:// 등 로컬 스킴 →
  //    상대 경로가 기기 로컬로 가서 실패하므로 Heroku 절대 URL.
  if (isNativeCapacitor()) return HEROKU_API_URL;

  const origin = (window.location?.origin || "").toLowerCase();
  if (
    origin.startsWith("capacitor://") ||
    origin.startsWith("ionic://") ||
    origin.startsWith("file://")
  ) {
    return HEROKU_API_URL;
  }
  // 3) 비-Capacitor WKWebView 등에서 origin 이 비정상인 경우(모바일 Safari 등)
  if (!origin || origin === "null" || !origin.startsWith("http")) {
    if (typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return HEROKU_API_URL;
    }
  }

  return process.env.NODE_ENV === "production" ? "" : "http://localhost:8080";
}

/** OAuth 는 로그인 API 와 같은 호스트에서 시작해야 세션·계정이 맞는다. */
export function getOAuthOrigin() {
  const base = getApiBaseUrl();
  if (base && base.startsWith("http")) return base.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin?.startsWith("http")) {
    return window.location.origin;
  }
  return HEROKU_API_URL;
}
