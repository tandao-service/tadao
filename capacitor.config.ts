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
    androidScheme: "https",
    hostname: "tadaomarket.com",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
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
