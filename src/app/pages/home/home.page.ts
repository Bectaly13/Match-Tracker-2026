import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';

import { HomeButtonComponent } from 'src/app/components/home-button/home-button.component';

import { ThemeService } from 'src/app/services/theme';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HomeButtonComponent]
})
export class HomePage implements ViewWillEnter {
  a: number = 0;

  constructor(
    private theme: ThemeService
  ) { }

  async ionViewWillEnter() {
    await this.initTheme();
  }

  async initTheme() {
    await this.theme.initTheme();
  }
}
