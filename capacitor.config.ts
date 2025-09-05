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
      backgroundColor: "#f97316",
      androidSpinnerStyle: "large",
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "1033579054775-p1lhnkja286tij6ta1ssfo1ld1vlkbm6.apps.googleusercontent.com", // from Firebase console
      forceCodeForRefreshToken: true,
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
