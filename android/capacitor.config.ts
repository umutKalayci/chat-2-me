import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chat2me.app',
  appName: 'Chat2Me',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
