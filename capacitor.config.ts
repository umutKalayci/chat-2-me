import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chat2me.app',
  appName: 'chat-2-me',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
