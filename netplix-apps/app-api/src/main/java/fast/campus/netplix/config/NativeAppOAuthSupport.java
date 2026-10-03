package fast.campus.netplix.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * SFSafariViewController 는 WKWebView 쿠키를 공유하지 않는다.
 * 네이티브 앱은 OAuth 시작 URL 에 platform=native 를 붙이고,
 * 브리지 페이지에서 X-App-Platform 쿠키도 같은 브라우저에 심는다.
 */
public class NativeAppOAuthSupport extends OncePerRequestFilter {

    public static final String SESSION_KEY = "NETPLIX_NATIVE_APP";

    public static boolean isNative(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("X-App-Platform".equals(cookie.getName()) && "native".equals(cookie.getValue())) {
                    return true;
                }
            }
        }
        HttpSession session = request.getSession(false);
        return session != null && Boolean.TRUE.equals(session.getAttribute(SESSION_KEY));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String uri = request.getRequestURI();
        if (uri != null && uri.contains("/oauth2/authorization/") && "native".equals(request.getParameter("platform"))) {
            request.getSession(true).setAttribute(SESSION_KEY, Boolean.TRUE);
        }
        filterChain.doFilter(request, response);
    }
}
