package fast.campus.netplix.movie;

import java.util.Locale;

/**
 * movie there 카탈로그 범위: 한국영화·한국 DVD·한국 음악영화,
 * 그리고 한국을 배경·제작국·대사로 둔 외국영화만 남긴다.
 */
public final class KoreaCatalogScope {

    private KoreaCatalogScope() {
    }

    public static boolean keep(NetplixMovie movie) {
        return keep(movie, false);
    }

    public static boolean keep(NetplixMovie movie, boolean hasKoreaRegionMapping) {
        if (movie == null) {
            return false;
        }
        if (hasKoreaRegionMapping) {
            return true;
        }
        if (isKoreanLanguage(movie)) {
            return true;
        }
        if (isKrProduction(movie)) {
            return true;
        }
        if (isSpokenKorean(movie)) {
            return true;
        }
        return mentionsKorea(movie);
    }

    static boolean isKoreanLanguage(NetplixMovie movie) {
        String lang = movie.getOriginalLanguage();
        return lang != null && "ko".equalsIgnoreCase(lang.trim());
    }

    static boolean isKrProduction(NetplixMovie movie) {
        String countries = normalize(movie.getProductionCountries());
        if (countries.isEmpty()) {
            return false;
        }
        return containsToken(countries, "kr")
                || containsToken(countries, "korea")
                || countries.contains("south korea")
                || countries.contains("korea, republic")
                || countries.contains("대한민국")
                || countries.contains("한국");
    }

    static boolean isSpokenKorean(NetplixMovie movie) {
        String langs = normalize(movie.getSpokenLanguages());
        if (langs.isEmpty()) {
            return false;
        }
        return containsToken(langs, "ko")
                || containsToken(langs, "korean")
                || langs.contains("한국어");
    }

    static boolean mentionsKorea(NetplixMovie movie) {
        String haystack = normalize(join(
                movie.getMovieName(),
                movie.getOriginalTitle(),
                movie.getTagline(),
                movie.getOverview()));
        if (haystack.isEmpty()) {
            return false;
        }
        return haystack.contains("south korea")
                || haystack.contains(" korea")
                || haystack.contains("korean")
                || haystack.contains("한국");
    }

    private static String join(String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p != null && !p.isBlank()) {
                sb.append(' ').append(p);
            }
        }
        return sb.toString();
    }

    private static String normalize(String s) {
        return s == null ? "" : s.toLowerCase(Locale.ROOT);
    }

    private static boolean containsToken(String hay, String token) {
        String h = " " + hay.replace(',', ' ') + " ";
        return h.contains(" " + token + " ");
    }
}
