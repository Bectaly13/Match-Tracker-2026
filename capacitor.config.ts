import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.mt26',
  appName: 'Match Tracker 2026',
  webDir: 'www',

  plugins: {
    LocalNotifications: {
      smallIcon: "res://drawable/football",
      iconColor: "#1F7D36"
    }
  }
};

export default config;