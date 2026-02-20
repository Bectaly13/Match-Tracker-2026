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

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonToggle, CommonModule, FormsModule, HeaderComponent, AddChannelComponent]
})
export class SettingsPage implements ViewWillEnter {
  notificationsBool: boolean = false;
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
    await this.initNotificationsBool();
    await this.initThemes();
    await this.initChannels();
  }

  async initTheme() {
    await this.theme.initTheme();
  }

  async initNotificationsBool() {
    const perm = await this.notif.checkPermissions();

    if(perm != "granted") {
      this.notificationsBool = false;
      await this.storage.set("notifications", false);
    }

    else {
      this.notificationsBool = await this.storage.get("notifications");
    }
  }

  async initThemes() {
    this.themes = this.db.themes;
    this.currentTheme = await this.storage.get("theme");
  }

  async initChannels() {
    this.channels = await this.storage.get("channels");
  }

  async toggleChange(event: CustomEvent) {
    const toggleState: boolean = event.detail.checked;

    if(toggleState) {
      await this.enableNotifications();
    }

    else {
      await this.disableNotifications();
    }
  }

  async enableNotifications() {
    await this.notif.requestPermissions();

    if(await this.notif.checkPermissions() != "granted") {
      alert("Les notifications sont actuellement désactivées. Pour les activer, rendez-vous dans les paramètres de votre téléphone et modifiez les autorisations de l'application.");
      this.notificationsBool = false;
      await this.storage.set("notifications", false);
      return;
    }

    else {
      await this.notif.init();
      await this.storage.set("notifications", true);
    }
  }

  async disableNotifications() {
    await this.notif.cancelAllNotifications();
    await this.storage.set("notifications", false);
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