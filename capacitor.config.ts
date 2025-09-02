import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tadaomarket.app",
  appName: "Tadao Market",
  webDir: "out", // placeholder build
  server: {
    url: "https://tadaomarket.com",
    androidScheme: "https", // for web access
    hostname: "tadaomarket.com",
  },
  plugins: {
    // 👇 Enable app URL schemes
    DeepLinks: {
      scheme: "tadaomarket",
      host: "tadaomarket.com",
    },
  },
};

export default config;
