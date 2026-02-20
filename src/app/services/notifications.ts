import { Injectable } from '@angular/core';

import { LocalNotifications, LocalNotificationSchema, ScheduleOptions } from '@capacitor/local-notifications';

import { StorageService } from './storage';
import { Match, Team } from './database';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private storage: StorageService
  ) { }

  async requestPermissions() {
    await LocalNotifications.requestPermissions();

    await this.storage.set("permissions", (await LocalNotifications.checkPermissions()).display);
  }

  async checkPermissions() {
    await this.storage.set("permissions", (await LocalNotifications.checkPermissions()).display);
    return await this.storage.get("permissions");
  }
  
  async init() {
    if(await this.checkPermissions() != "granted") return;

    await this.cancelAllNotifications();
    await this.createChannel();

    const enrichedMatches = await this.prepareMatchData();
    await this.scheduleAllMatchNotifications(enrichedMatches);
  }

  async cancelAllNotifications() {
    const db = await this.storage.get("db");
    const matches = db.matches;

    for(let match of matches) {
      await this.cancelNotification(match);
    }
  }

  async createChannel() {
    await LocalNotifications.createChannel({
      id: "match_reminder",
      name: "Match reminder",
      importance: 5,
    })
  }

  async prepareMatchData() {
    const db = await this.storage.get("db");
    const teams = db.teams;
    const matches = db.matches;

    const enrichedMatches = matches.map((match: Match) => {
      const [day, month] = match.date.split("/").map(Number);
      const [hour, minute] = match.time.split(":").map(Number);
    
      const matchDate = new Date(
        2026,
        month - 1,
        day,
        hour ?? 0,
        minute ?? 0
      );
    
      const team1 = teams.find((t: Team) => t.id === match.id_team_1);
      const team2 = teams.find((t: Team) => t.id === match.id_team_2);
    
      return {
        ...match,
        matchDate: matchDate,
        name_team_1: team1?.name ?? "???",
        name_team_2: team2?.name ?? "???",
      };
    });

    return enrichedMatches;
  }

  async cancelNotification(match: Match) {
    await LocalNotifications.cancel({
      notifications: [
        {id: match.id * 10 + 1},
        {id: match.id * 10 + 2}
      ]
    });
  }

  private async scheduleAllMatchNotifications(matches: any[]) {
    for(let match of matches) {
      await this.scheduleMatchNotification(match);
    }
  }

  private async scheduleMatchNotification(match: any) {
    const now = new Date();

    const oneHourBefore = new Date(match.matchDate.getTime() - 60 * 60 * 1000);
    const fiveMinutesBefore = new Date(match.matchDate.getTime() - 5 * 60 * 1000);

    let notifications: LocalNotificationSchema[] = [];

    if(oneHourBefore > now) { // ne pas prévoir une notification pour une date déjà passée
      notifications.push({
        id: match.id * 10 + 1,
        title: "Annonce de match",
        body: `${match.name_team_1} - ${match.name_team_2} commence dans 1 heure.`,
        largeBody: `${match.name_team_1} - ${match.name_team_2} commence dans 1 heure.`,
        summaryText: `${match.type}`,
        channelId: "match_reminder",
        schedule: {at: oneHourBefore}
      });
    }

    if(fiveMinutesBefore > now) { // ne pas prévoir une notification pour une date déjà passée
      notifications.push({
        id: match.id * 10 + 2,
        title: "Annonce de match",
        body: `${match.name_team_1} - ${match.name_team_2} commence dans 5 minutes.`,
        largeBody: `${match.name_team_1} - ${match.name_team_2} commence dans 5 minutes.`,
        summaryText: `${match.type}`,
        channelId: "match_reminder",
        schedule: {at: fiveMinutesBefore}
      });
    }

    const options: ScheduleOptions = { notifications };

    await LocalNotifications.schedule(options);
  }
}
