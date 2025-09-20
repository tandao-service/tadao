import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig & {
  assets?: {
    icon: { sources: string[] };
    splash: { sources: string[] };
  };
} = {
  appId: "com.tadaomarket.app",
  appName: "Tadao Market",
  webDir: "out",
  server: {
    url: "https://tadaomarket.com",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      // showSpinner: false,
      //launchShowDuration: 500,
      backgroundColor: "#f97316",
      androidSpinnerStyle: "large",
    },
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "androidClientId": "1033579054775-r208cpmoc90vusdpsdmh505ie0qc5773.apps.googleusercontent.com",
      "serverClientId": "1033579054775-p1lhnkja286tij6ta1ssfo1ld1vlkbm6.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    },
  },
  assets: {
    icon: {
      sources: ["public/assets/icon.png"],
    },
    splash: {
      sources: ["public/assets/splash.png"],
    },
  },
};

export default config;
