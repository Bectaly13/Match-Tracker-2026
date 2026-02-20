import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

import { VersionHandlerService } from 'src/app/services/version-handler';
import { ThemeService } from 'src/app/services/theme';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class WelcomePage implements ViewWillEnter {

  constructor(
    private versionHandler: VersionHandlerService,
    private theme: ThemeService,
    private nav: NavController
  ) { }

  async ionViewWillEnter() {
    await this.initTheme();
    await this.versionHandler.init();
    await this.delay(2000);
    this.goToHome();
  }

  async initTheme() {
    await this.theme.initTheme();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  goToHome() {
    this.nav.navigateRoot(["home"]);
  }
}