import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { EditPlayedMatchComponent } from 'src/app/components/edit-played-match/edit-played-match.component';
import { EditUpcomingMatchComponent } from 'src/app/components/edit-upcoming-match/edit-upcoming-match.component';

import { ThemeService } from 'src/app/services/theme';
import { StorageService } from 'src/app/services/storage';
import { Team, Match } from 'src/app/services/database';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, EditPlayedMatchComponent, EditUpcomingMatchComponent]
})
export class GroupPage implements ViewWillEnter {
  groupName: string = "";

  teams: Team[] = [];
  matches: Match[] = [];
  playedMatches: any[] = [];
  upcomingMatches: any[] = [];

  groupStandings: any[] = [];

  showEditPlayedMatchModal: boolean = false;
  showEditUpcomingMatchModal: boolean = false;

  selectedMatchId: number = 0;

  async ionViewWillEnter() {
    await this.initTheme();
    this.getGroupName();
    await this.getTeams();
    await this.getMatches();
    this.categorizeMatches();
    this.buildStandings();
  }

  constructor(
    private theme: ThemeService,
    private route: ActivatedRoute,
    private storage: StorageService
  ) { }

  async initTheme() {
    this.theme.initTheme();
  }

  getGroupName() {
    this.groupName = String(this.route.snapshot.paramMap.get("groupName"));
  }

  async getTeams() {
    const teams: Team[] = (await this.storage.get("db")).teams;
    this.teams = teams.filter((t: Team) => t.group_name == this.groupName);
  }

  async getMatches() {
    const db = await this.storage.get("db");
    const allMatches = db.matches;

    this.matches = allMatches
      .filter((m: Match) => m.type == "Groupe " + this.groupName)
      .map((m: Match) => {
        // récupération des équipes
        const team1 = this.teams.find((t: Team) => t.id === m.id_team_1);
        const team2 = this.teams.find((t: Team) => t.id === m.id_team_2);

        return {
          ...m,
          name_team_1: team1?.name ?? "???",
          short_name_team_1: team1?.short_name ?? "???",
          name_team_2: team2?.name ?? "???",
          short_name_team_2: team2?.short_name ?? "???"
        };
      })
  }

  categorizeMatches() {
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
  }

  buildStandings() {
    // Initialisation des stats pour chaque équipe
    this.groupStandings = this.teams.map(team => ({
      teamId: team.id,
      short_name: team.short_name,

      J: 0,
      G: 0,
      N: 0,
      P: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      Pts: 0
    }));

    // On parcourt les matchs joués uniquement
    this.playedMatches
      .filter(match => match.played)
      .forEach(match => {

        const team1 = this.groupStandings.find(t => t.teamId === match.id_team_1);
        const team2 = this.groupStandings.find(t => t.teamId === match.id_team_2);

        if (!team1 || !team2) return;

        const score1 = Number(match.score_team_1);
        const score2 = Number(match.score_team_2);

        // Match joué
        team1.J++;
        team2.J++;

        // Buts
        team1.goalsFor += score1;
        team1.goalsAgainst += score2;

        team2.goalsFor += score2;
        team2.goalsAgainst += score1;

        // Résultat
        if (score1 > score2) {
          team1.G++;
          team2.P++;
          team1.Pts += 3;
        }
        else if (score1 < score2) {
          team2.G++;
          team1.P++;
          team2.Pts += 3;
        }
        else {
          team1.N++;
          team2.N++;
          team1.Pts += 1;
          team2.Pts += 1;
        }
      });

    // Calcul du goal average
    this.groupStandings.forEach(team => {
      team.goalDiff = team.goalsFor - team.goalsAgainst;
    });

    //Tri
    this.groupStandings.sort((a, b) => {
      if (b.Pts !== a.Pts) {
        return b.Pts - a.Pts;
      }
      if (b.goalDiff !== a.goalDiff) {
        return b.goalDiff - a.goalDiff;
      }
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
      return 0;
    });
  }

  openEditPlayedMatchModal(matchId: number) {
    this.selectedMatchId = matchId;
    this.showEditPlayedMatchModal = true;
  }

  openEditUpcomingMatchModal(matchId: number) {
    this.selectedMatchId = matchId;
    this.showEditUpcomingMatchModal = true;
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

    await this.updatePlayedMatch(event);
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

    await this.updateUpcomingMatch(event);
  }

  async updatePlayedMatch(data: {
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
    this.categorizeMatches();
    this.buildStandings();
  }

  async updateUpcomingMatch(data: {
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
    this.categorizeMatches();
  }
}
