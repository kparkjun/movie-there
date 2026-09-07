import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moviethere.app',
  appName: 'movie there',
  webDir: 'build',
  server: {
    url: 'https://movie-there-290fdbcabcb3.herokuapp.com',
    cleartext: false,
    // 외부 사이트(구석구석 등)가 WKWebView 를 점유하면 뒤로가기가 앱으로 돌아오지 않는다.
    allowNavigation: ['movie-there-290fdbcabcb3.herokuapp.com'],
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Browser: {
      presentationStyle: 'popover'
    },
    App: {
      launchShowDuration: 0
    },
    Geolocation: {
      permissions: {
        location: '가까운 촬영지·매장·관광 정보를 보여 주기 위해 위치가 필요합니다.'
      }
    }
  },
  ios: {
    scheme: 'moviethere'
  },
  android: {
    buildOptions: {
      signingType: 'apksigner',
    },
  }
};

export default config;
