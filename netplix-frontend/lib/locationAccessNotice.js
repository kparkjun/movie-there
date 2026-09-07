/** 정보통신망법 제22조의2 — 위치 접근권한 사전 고지·동의 상태 */

export const LOCATION_NOTICE_KEY = "mt.locationAccessNotice.v1";

let presenter = null;
let inflight = null;

export function getLocationNoticeState() {
  try {
    return localStorage.getItem(LOCATION_NOTICE_KEY) || "";
  } catch {
    return "";
  }
}

export function setLocationNoticeState(value) {
  try {
    if (value) localStorage.setItem(LOCATION_NOTICE_KEY, value);
    else localStorage.removeItem(LOCATION_NOTICE_KEY);
  } catch {
    /* ignore */
  }
}

export function bindLocationNoticePresenter(fn) {
  presenter = fn;
  return () => {
    if (presenter === fn) presenter = null;
  };
}

/**
 * OS 위치 권한을 요청하기 전에 인앱 고지 동의를 받는다.
 * @param {{ promptIfDeclined?: boolean }} [opts]
 * @returns {Promise<boolean>} 동의 여부
 */
export async function ensureLocationAccessConsent({ promptIfDeclined = false } = {}) {
  const state = getLocationNoticeState();
  if (state === "accepted") return true;
  if (state === "declined" && !promptIfDeclined) return false;
  if (inflight) return inflight;
  if (!presenter) return false;
  inflight = Promise.resolve()
    .then(() => presenter())
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
