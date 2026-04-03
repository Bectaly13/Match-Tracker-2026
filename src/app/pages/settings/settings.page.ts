import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonToggle, ViewWillEnter } from '@ionic/angular/standalone';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { AddChannelComponent } from 'src/app/components/add-channel/add-channel.component';

import { ThemeService, Theme } from 'src/app/services/theme';
import { DatabaseService } from 'src/app/services/database';
import { StorageService } from 'src/app/services/storage';
import { NotificationsService } from 'src/app/services/notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonToggle, CommonModule, FormsModule, HeaderComponent, AddChannelComponent]
})
export class SettingsPage implements ViewWillEnter {
  notificationsBoolGroups: boolean = false;
  notificationsBool16: boolean = false;
  notificationsBool8: boolean = false;
  notificationsBool4: boolean = false;
  notificationsBool2: boolean = false;
  notificationsBool1: boolean = false;
  themes: Theme[] = [];
  channels: string[] = [];

  currentTheme!: Theme;

  showAddChannelModal: boolean = false;

  constructor(
    private theme: ThemeService,
    private db: DatabaseService,
    private storage: StorageService,
    private notif: NotificationsService
  ) { }

  async ionViewWillEnter() {
    await this.initTheme();
    await this.initNotifications();
    await this.initThemes();
    await this.initChannels();
  }

  async initTheme() {
    await this.theme.initTheme();
  }

  async initNotifications() {    
    this.notificationsBoolGroups = await this.storage.get("notificationsGroups");
    this.notificationsBool16 = await this.storage.get("notifications16");
    this.notificationsBool8 = await this.storage.get("notifications8");
    this.notificationsBool4 = await this.storage.get("notifications4");
    this.notificationsBool2 = await this.storage.get("notifications2");
    this.notificationsBool1 = await this.storage.get("notifications1");
  }

  async initThemes() {
    this.themes = this.db.themes;
    this.currentTheme = await this.theme.getTheme();
  }

  async initChannels() {
    this.channels = await this.storage.get("channels");
  }

  async toggleChange(event: CustomEvent, toggleLabel: string) {
    const toggleState: boolean = event.detail.checked;
    await this.notif.requestPermissions();

    const perm = await this.notif.checkPermissions();
    if(perm == "denied") alert("Les notifications ont été désactivées. Pour les réactiver, allez dans les paramètres de votre appareil pour accorder les autorisations à l'application.")

    const notifState = toggleState && (perm == "granted")

    switch (toggleLabel) {

      case "groups":
        this.notificationsBoolGroups = notifState;
        await this.storage.set("notificationsGroups", notifState);
        break;

      case "1/16":
        this.notificationsBool16 = notifState;
        await this.storage.set("notifications16", notifState);
        break;

      case "1/8":
        this.notificationsBool8 = notifState;
        await this.storage.set("notifications8", notifState);
        break;

      case "1/4":
        this.notificationsBool4 = notifState
        await this.storage.set("notifications4", notifState);
        break;

      case "1/2":
        this.notificationsBool2 = notifState;
        await this.storage.set("notifications2", notifState);
        break;

      case "finale":
        this.notificationsBool1 = notifState;
        await this.storage.set("notifications1", notifState);
        break;
    }

    // À chaque modification → on reschedule proprement
    if (perm == "granted") {
      await this.notif.init();
    }
  }

  async changeTheme(theme: Theme) {
    this.currentTheme = theme;
    await this.theme.applyTheme(theme);
  }

  async deleteChannel(channel: string) {
    const updatedChannels = this.channels.filter(c => c !== channel);

    await this.storage.set("channels", updatedChannels);

    this.channels = updatedChannels;

    const matches = await this.db.getTable("matches");

    const updatedMatches = matches.map((match: any) => {
      if (match.channel === channel) {
        return { ...match, channel: "-" };
      }
      return match;
    });

    await this.db.updateTable("matches", updatedMatches);
  }

  openAddChannelModal() {
    this.showAddChannelModal = true;
  }

  closeAddChannelModal(newChannel?: string) {
    this.showAddChannelModal = false;

    if (newChannel) {
      this.addChannel(newChannel);
    }
  }

  async addChannel(channel: string) {
    if (this.channels.includes(channel)) return;

    const updatedChannels = [...this.channels, channel];

    await this.storage.set("channels", updatedChannels);

    this.channels = updatedChannels;
  }
}