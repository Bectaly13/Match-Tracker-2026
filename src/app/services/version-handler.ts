import { Injectable } from '@angular/core';

import { StorageService } from './storage';
import { DatabaseService } from './database';

@Injectable({
  providedIn: 'root',
})
export class VersionHandlerService {
  private appVersion: number = 4;

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

      await this.storage.set("permissions", "prompt");
      await this.storage.set("notifications", false);
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

      await this.storage.set("version", this.appVersion);
    }
  }

  async updateToV2() {
    // v2 : modification de la structure des matchs dans la BDD
    const matches = this.db.db.matches;
    await this.db.updateTable("matches", matches);
  }

  async updateToV3() {
    // v3 : implémentation de notifications
    await this.storage.set("permissions", "prompt");
    await this.storage.set("notifications", false);
  }

  async updateToV4() {
    // v4 : version de démo avec modification des dates des matchs
    const matches = this.db.db.matches;
    await this.db.updateTable("matches", matches);
  }
}
