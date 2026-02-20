import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { SwiperSlideContentComponent } from 'src/app/components/swiper-slide-content/swiper-slide-content.component';

import { ThemeService } from 'src/app/services/theme';
import { StorageService } from 'src/app/services/storage';
import { Match, Team } from 'src/app/services/database';
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-knockouts',
  templateUrl: './knockouts.page.html',
  styleUrls: ['./knockouts.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule, HeaderComponent, SwiperSlideContentComponent]
})
export class KnockoutsPage implements ViewWillEnter {
  matches: Match[] = [];
  matches16: any[] = [];
  matches8: any[] = [];
  matches4: any[] = [];
  matches2: any[] = [];
  matches1: any[] = [];

  matchTypes: string[] = ["1/16", "1/8", "1/4", "1/2", "Finales"];

  slideIndex: number = 0;

  async ionViewWillEnter() {
    await this.initTheme();
    await this.getMatches();
    await this.categorizeMatches();
  }

  constructor(
    private theme: ThemeService,
    private storage: StorageService
  ) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline
    });
  }

  async initTheme() {
    await this.theme.initTheme();
  }

  async getMatches() {
    const db = await this.storage.get("db");
    this.matches = db.matches;
  }

  async categorizeMatches() {
    const db = await this.storage.get("db");
    const teams = db.teams;

    const now = new Date();

    const enrichedMatches = this.matches.map(match => {
      const [day, month] = match.date.split("/").map(Number);
      const [hour, minute] = match.time.split(":").map(Number);

      const matchDate = new Date(
        2026,
        month - 1,
        day,
        hour ?? 0,
        minute ?? 0
      );

      const state = matchDate <= now ? "played" : "upcoming";

      const team1 = teams.find((t: Team) => t.id === match.id_team_1);
      const team2 = teams.find((t: Team) => t.id === match.id_team_2);

      return {
        ...match,
        state,
        name_team_1: team1?.name ?? "???",
        short_name_team_1: team1?.short_name ?? "???",
        name_team_2: team2?.name ?? "???",
        short_name_team_2: team2?.short_name ?? "???"
      };
    });

    this.matches16 = [...enrichedMatches.filter(m => m.type === "1/16")];
    this.matches8 = [...enrichedMatches.filter(m => m.type === "1/8")];
    this.matches4 = [...enrichedMatches.filter(m => m.type === "1/4")];
    this.matches2 = [...enrichedMatches.filter(m => m.type === "1/2")];
    this.matches1 = [...enrichedMatches.filter(m => m.type === "Petite finale" || m.type == "Finale")];
  }

  async reloadMatches() {
    await this.deduceKnockoutMatches();
    await this.getMatches();
    await this.categorizeMatches();
  }

  async deduceKnockoutMatches() {
    const db = await this.storage.get("db");
    if (!db?.matches) return;

    const matches = db.matches;

    const rounds = ["1/16", "1/8", "1/4", "1/2"];

    for (let i = 0; i < rounds.length; i++) {

      const currentRound = rounds[i];
      const nextRound = rounds[i + 1];

      const currentMatches = matches
        .filter((m: any) => m.type === currentRound)
        .sort((a: any, b: any) => a.id - b.id);

      const nextMatches = matches
        .filter((m: any) => m.type === nextRound)
        .sort((a: any, b: any) => a.id - b.id);

      for (let j = 0; j < currentMatches.length; j += 2) {

        const match1 = currentMatches[j];
        const match2 = currentMatches[j + 1];
        const targetMatch = nextMatches[Math.floor(j / 2)];

        if (!targetMatch) continue;

        if (match1?.played) {
          const winner1 = this.getWinner(match1);
          targetMatch.id_team_1 = winner1 ?? 0;
        } else {
          targetMatch.id_team_1 = 0;
        }

        if (match2?.played) {
          const winner2 = this.getWinner(match2);
          targetMatch.id_team_2 = winner2 ?? 0;
        } else {
          targetMatch.id_team_2 = 0;
        }
      }
    }

    const semiFinals = matches
      .filter((m: any) => m.type === "1/2")
      .sort((a: any, b: any) => a.id - b.id);

    const finalMatch = matches.find((m: any) => m.type === "Finale");
    const thirdPlaceMatch = matches.find((m: any) => m.type === "Petite finale");

    if (semiFinals.length === 2 && finalMatch && thirdPlaceMatch) {

      const semi1 = semiFinals[0];
      const semi2 = semiFinals[1];

      if (semi1.played) {
        const winner1 = this.getWinner(semi1);
        const loser1 = this.getLoser(semi1);

        finalMatch.id_team_1 = winner1 ?? 0;
        thirdPlaceMatch.id_team_1 = loser1 ?? 0;
      } else {
        finalMatch.id_team_1 = 0;
        thirdPlaceMatch.id_team_1 = 0;
      }

      if (semi2.played) {
        const winner2 = this.getWinner(semi2);
        const loser2 = this.getLoser(semi2);

        finalMatch.id_team_2 = winner2 ?? 0;
        thirdPlaceMatch.id_team_2 = loser2 ?? 0;
      } else {
        finalMatch.id_team_2 = 0;
        thirdPlaceMatch.id_team_2 = 0;
      }
    }

    await this.storage.set("db", db);

    this.matches = [...db.matches];
  }

  getWinner(match: any): number | null {
    const score1 = (match.score_team_1 ?? 0) + (match.extra_score_team_1 ?? 0);
    const score2 = (match.score_team_2 ?? 0) + (match.extra_score_team_2 ?? 0);

    if (score1 > score2) return match.id_team_1;
    if (score2 > score1) return match.id_team_2;

    return null;
  }

  getLoser(match: any): number | null {
    const score1 = (match.score_team_1 ?? 0) + (match.extra_score_team_1 ?? 0);
    const score2 = (match.score_team_2 ?? 0) + (match.extra_score_team_2 ?? 0);

    if (score1 > score2) return match.id_team_2;
    if (score2 > score1) return match.id_team_1;

    return null;
  }

  goPrev() {
    if(this.slideIndex != 0) this.slideIndex --;
  }

  goNext() {
    if(this.slideIndex != this.matchTypes.length - 1) this.slideIndex ++;
  }
}