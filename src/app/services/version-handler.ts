import { Injectable } from '@angular/core';

import { StorageService } from './storage';
import { DatabaseService } from './database';

@Injectable({
  providedIn: 'root',
})
export class VersionHandlerService {
  private appVersion: number = 6;

  constructor(
    private storage: StorageService,
    private db: DatabaseService
  ) { }

  async init() {
    const userVersion: number = await this.storage.get("version");

    if(!userVersion) {
      await this.storage.set("version", this.appVersion);

      // await this.storage.set("theme", this.defaultTheme);
      // defaultTheme is handled by themeService

      await this.storage.set("channels", this.db.channels);
      await this.storage.set("db", this.db.db);

      await this.storage.set("notificationsGroups", false);
      await this.storage.set("notifications16", false);
      await this.storage.set("notifications8", false);
      await this.storage.set("notifications4", false);
      await this.storage.set("notifications2", false);
      await this.storage.set("notifications1", false);
    }

    else if(userVersion == this.appVersion) {
      return;
    }

    else {      
      if(userVersion <= 1) { // user en v1
        await this.updateToV2(); 
      }

      if(userVersion <= 2) { // user en v1 ou v2
        await this.updateToV3();
      }

      if(userVersion <= 3) { // user en v1, v2 ou v3
        await this.updateToV4();
      }

      if(userVersion <= 4) {// user en v1, v2, v3 ou v4
        await this.updateToV5();
      }

      if(userVersion <= 5) {// user en v1, v2, v3, v4 ou v5
        await this.updateToV6();
      }

      await this.storage.set("version", this.appVersion);
    }
  }

  private async updateToV2() {
    // v2 : modification de la structure des matchs dans la BDD
    const matches = this.db.db.matches;
    await this.db.updateTable("matches", matches);
  }

  private async updateToV3() {
    // v3 : implémentation de notifications
    await this.storage.set("notifications", false);
  }

  private async updateToV4() {
    // v4 : version de démo avec modification des dates des matchs
    const matches = this.db.db.matches;
    await this.db.updateTable("matches", matches);
  }

  private async updateToV5() {
    // v5 : annulation de la version de démo et nouvelles notifications
    const matches = this.db.db.matches;
    await this.db.updateTable("matches", matches);

    await this.storage.remove("notifications");

    await this.storage.set("notificationsGroups", false);
    await this.storage.set("notifications16", false);
    await this.storage.set("notifications8", false);
    await this.storage.set("notifications4", false);
    await this.storage.set("notifications2", false);
    await this.storage.set("notifications1", false);
  }

  private async updateToV6() {
    // v6 : ajout des 6 dernières équipes qualifiées à la base de données
    const teams = this.db.db.teams;
    await this.db.updateTable("teams", teams);
  }
}
