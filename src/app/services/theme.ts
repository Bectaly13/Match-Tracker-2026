import { Injectable } from '@angular/core';

import { StorageService } from './storage';

export type Theme = "Football" | "Clair" | "Sombre";

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private defaultTheme: Theme = "Football";
  private themes = ["theme-foot", "theme-light", "theme-dark"];

  constructor(private storage: StorageService) { }

  async initTheme() {
    const theme = await this.storage.get("theme") || this.defaultTheme;
    this.applyTheme(theme);
  }

  async applyTheme(theme: Theme) {
    await this.storage.set("theme", theme);
    document.body.classList.remove(...this.themes);

    switch (theme) {
      case "Football":
        document.body.classList.add("theme-foot");
        break;
      case "Clair":
        document.body.classList.add("theme-light");
        break;
      case "Sombre":
        document.body.classList.add("theme-dark");
    }
  }

  async getTheme() {
    return await this.storage.get("theme") || this.defaultTheme;
  }
}