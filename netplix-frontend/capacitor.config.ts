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
