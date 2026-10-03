/**
 * movie there 전용 API. touraz-dvdholic 으로는 보내지 않는다.
 * 웹뷰가 이미 이 호스트이면 상대 경로를 쓴다.
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

export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    const env = process.env.REACT_APP_API_URL;
    return env && env !== "" ? env : "";
  }
  const env = process.env.REACT_APP_API_URL;
  if (env && env !== "") return env;

  if (typeof window !== "undefined") {
    const host = (window.location?.host || "").toLowerCase();
    if (isNativeCapacitor() && host === HEROKU_API_HOST) return "";
  }

  if (isNativeCapacitor()) return HEROKU_API_URL;

  const origin = (window.location?.origin || "").toLowerCase();
  if (
    origin.startsWith("capacitor://") ||
    origin.startsWith("ionic://") ||
    origin.startsWith("file://")
  ) {
    return HEROKU_API_URL;
  }
  if (!origin || origin === "null" || !origin.startsWith("http")) {
    if (typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return HEROKU_API_URL;
    }
  }

  return process.env.NODE_ENV === "production" ? "" : "http://localhost:8080";
}
