import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { EditUpcomingMatchComponent } from 'src/app/components/edit-upcoming-match/edit-upcoming-match.component';

import { ThemeService } from 'src/app/services/theme';
import { StorageService } from 'src/app/services/storage';
import { DatabaseService, Match, Team } from 'src/app/services/database';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.page.html',
  styleUrls: ['./upcoming.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, EditUpcomingMatchComponent]
})
export class UpcomingPage implements ViewWillEnter{
  matches: Match[] = [];
  upcomingMatches: any[] = [];

  showEditUpcomingMatchModal: boolean = false;

  selectedMatchId: number = 0;

  constructor(
    private theme: ThemeService,
    private storage: StorageService,
    private db: DatabaseService
  ) { }

  async ionViewWillEnter() {
    await this.initTheme();
    await this.getMatches();
    await this.getUpcomingMatches();
  }

  async initTheme() {
    await this.theme.initTheme();
  }

  async getMatches() {
    this.matches = (await this.storage.get("db")).matches;
  }

  async getUpcomingMatches() {
    if (!this.matches || !this.db) return;

    const teams = (await this.storage.get("db")).teams; // table des équipes

    const now = new Date();

    // On filtre les matchs futurs
    this.upcomingMatches = this.matches
      .filter(match => {
        const [day, month] = match.date.split("/").map(Number);
        const [hour, minute] = match.time.split(":").map(Number);

        const matchDate = new Date(
          2026,
          month - 1,
          day,
          hour ?? 0,
          minute ?? 0
        );

        return matchDate > now;
      })
      .map(match => {
        // récupération des équipes
        const team1 = teams.find((t: Team) => t.id === match.id_team_1);
        const team2 = teams.find((t: Team) => t.id === match.id_team_2);

        return {
          ...match,
          name_team_1: team1?.name ?? "???",
          short_name_team_1: team1?.short_name ?? "???",
          name_team_2: team2?.name ?? "???",
          short_name_team_2: team2?.short_name ?? "???"
        };
      })
      // trier par date+heure croissante
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number);
        const [hourA, minuteA] = a.time.split(":").map(Number);

        const [dayB, monthB] = b.date.split("/").map(Number);
        const [hourB, minuteB] = b.time.split(":").map(Number);

        const dateA = new Date(2026, monthA - 1, dayA, hourA ?? 0, minuteA ?? 0);
        const dateB = new Date(2026, monthB - 1, dayB, hourB ?? 0, minuteB ?? 0);

        return dateA.getTime() - dateB.getTime();
      });
  }

  openEditUpcomingMatchModal(matchId: number) {
    this.selectedMatchId = matchId;
    this.showEditUpcomingMatchModal = true;
  }

  async closeEditUpcomingMatchModal(event?: {
      matchId: number,
      newTeam1Id: number,
      newTeam2Id: number,
      newChannel: string,
      newNote: string
  }) {
    
    this.showEditUpcomingMatchModal = false;

    if(!event) return;

    await this.updateMatch(event);
  }

  async updateMatch(data: {
    matchId: number,
    newChannel: string,
    newNote: string,
    newTeam1Id: number,
    newTeam2Id: number
  }) {

    let db = await this.storage.get("db");

    db.matches = db.matches.map((m: Match) => {
      if (m.id === data.matchId) {
        return {
          ...m,
          channel: data.newChannel,
          note: data.newNote,
          id_team_1: data.newTeam1Id,
          id_team_2: data.newTeam2Id
        };
      }
      return m;
    });

    await this.storage.set("db", db);

    await this.getMatches();
    await this.getUpcomingMatches();
  }
}
