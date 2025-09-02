import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.tadaomarket.app",
  appName: "Tadao Market",
  webDir: "out",        // still needed, can be a small placeholder build
  server: {
    url: "https://tadaomarket.com", // your hosted Next.js app
  },
};

export default config;
