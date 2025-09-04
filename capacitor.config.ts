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
      // launchShowDuration: 3000,
      backgroundColor: "#f97316",
      androidSpinnerStyle: "large",
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
