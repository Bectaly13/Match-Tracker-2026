import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { EditPlayedMatchComponent } from 'src/app/components/edit-played-match/edit-played-match.component';

import { ThemeService } from 'src/app/services/theme';
import { StorageService } from 'src/app/services/storage';
import { Match, Team } from 'src/app/services/database';

@Component({
  selector: 'app-played',
  templateUrl: './played.page.html',
  styleUrls: ['./played.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, EditPlayedMatchComponent]
})
export class PlayedPage implements ViewWillEnter {
  matches: Match[] = [];
  playedMatches: any[] = [];

  showEditPlayedMatchModal: boolean = false;

  selectedMatchId: number = 0;

  constructor(
    private theme: ThemeService,
    private storage: StorageService
  ) { }

  async ionViewWillEnter() {
    await this.initTheme();
    await this.getMatches();
    await this.getPlayedMatches();    
  }

  async initTheme() {
    await this.theme.initTheme();
  }

  async getMatches() {
    this.matches = (await this.storage.get("db")).matches;
  }

  async getPlayedMatches() {
    if (!this.matches) return;

    const teams = (await this.storage.get("db")).teams;

    const now = new Date();

    this.playedMatches = this.matches
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

        // Match déjà joué
        return matchDate <= now;
      })
      .map(match => {
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
      // Trier par date décroissante (plus récent en premier)
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number);
        const [hourA, minuteA] = a.time.split(":").map(Number);

        const [dayB, monthB] = b.date.split("/").map(Number);
        const [hourB, minuteB] = b.time.split(":").map(Number);

        const dateA = new Date(2026, monthA - 1, dayA, hourA ?? 0, minuteA ?? 0);
        const dateB = new Date(2026, monthB - 1, dayB, hourB ?? 0, minuteB ?? 0);

        return dateB.getTime() - dateA.getTime();
      });
  }

  openEditPlayedMatchModal(matchId: number) {
    this.selectedMatchId = matchId;
    this.showEditPlayedMatchModal = true;
  }

  async closeEditPlayedMatchModal(event?: {
    matchId: number,
    newTeam1Id: number,
    newTeam1Score: number,
    newTeam1ExtraScore: number,
    newTeam2Id: number,
    newTeam2Score: number,
    newTeam2ExtraScore: number,
    newChannel: string,
    newNote: string,
    newState: boolean
  }) {
    
    this.showEditPlayedMatchModal = false;

    if(!event) return;

    await this.updateMatch(event);
  }

  async updateMatch(data: {
    matchId: number,
    newTeam1Id: number,
    newTeam1Score: number,
    newTeam1ExtraScore: number,
    newTeam2Id: number,
    newTeam2Score: number,
    newTeam2ExtraScore: number,
    newChannel: string,
    newNote: string,
    newState: boolean
  }) {

    let db = await this.storage.get("db");

    db.matches = db.matches.map((m: Match) => {
      if (m.id === data.matchId) {
        return {
          ...m,
          id_team_1: data.newTeam1Id,
          score_team_1: data.newTeam1Score,
          extra_score_team_1: data.newTeam1ExtraScore,
          id_team_2: data.newTeam2Id,
          score_team_2: data.newTeam2Score,
          extra_score_team_2: data.newTeam2ExtraScore,
          channel: data.newChannel,
          note: data.newNote,
          played: data.newState
        };
      }
      return m;
    });

    await this.storage.set("db", db);

    await this.getMatches();
    await this.getPlayedMatches();
  }
}
