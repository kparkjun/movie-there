import axios from "@/lib/axiosConfig";
import { getApiBaseUrl } from "@/lib/apiConfig";

/**
 * CapacitorHttp 가 XMLHttpRequest 를 가로채면 iOS 에서 axios 가
 * JSON 을 "[object Object]" 로 읽거나 문자열로 남겨, 로그인·가입이
 * 서버에서는 성공했는데 화면에는 오류로 보인다.
 * 네이티브에서는 플러그인 응답을 직접 읽는다.
 */
function absoluteApiUrl(path) {
  const base = getApiBaseUrl();
  if (base && base.startsWith("http")) {
    return `${base.replace(/\/$/, "")}${path}`;
  }
  if (typeof window !== "undefined" && window.location?.origin?.startsWith("http")) {
    return new URL(path, window.location.origin).href;
  }
  return path;
}

function parseBody(data) {
  let current = data;
  for (let i = 0; i < 3; i += 1) {
    if (typeof current === "string") {
      const trimmed = current.trim();
      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) break;
      try {
        current = JSON.parse(trimmed);
        continue;
      } catch {
        break;
      }
    }
    if (
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      !("success" in current) &&
      current.data != null &&
      (typeof current.status === "number" || current.headers || current.url)
    ) {
      current = current.data;
      continue;
    }
    break;
  }
  return current;
}

export function unwrapApiPayload(data) {
  return parseBody(data);
}

export async function postApi(path, body) {
  let native = false;
  try {
    const { Capacitor, CapacitorHttp } = await import("@capacitor/core");
    native = Capacitor?.isNativePlatform?.() === true && typeof CapacitorHttp?.post === "function";
    if (native) {
      const res = await CapacitorHttp.post({
        url: absoluteApiUrl(path),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: body,
      });
      const data = parseBody(res?.data);
      if (res.status >= 400) {
        const error = new Error("api");
        error.response = { status: res.status, data };
        throw error;
      }
      return { data };
    }
  } catch (error) {
    if (error?.response) throw error;
  }

  return axios.post(path, body);
}
