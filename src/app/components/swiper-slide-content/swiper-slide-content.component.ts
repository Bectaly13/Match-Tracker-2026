import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditPlayedMatchComponent } from '../edit-played-match/edit-played-match.component';
import { EditUpcomingMatchComponent } from '../edit-upcoming-match/edit-upcoming-match.component';

import { StorageService } from 'src/app/services/storage';
import { Match } from 'src/app/services/database';

@Component({
  selector: 'app-swiper-slide-content',
  templateUrl: './swiper-slide-content.component.html',
  styleUrls: ['./swiper-slide-content.component.scss'],
  imports: [CommonModule, EditPlayedMatchComponent, EditUpcomingMatchComponent]
})
export class SwiperSlideContentComponent {
  matches = input.required<any[]>();
  reload = output<void>();

  showEditPlayedMatchModal: boolean = false;
  showEditUpcomingMatchModal: boolean = false;

  selectedMatchId: number = 0;

  constructor(
    private storage: StorageService
  ) { }

  openEditMatchModal(matchId: number, state: string) {
    if(state == "played") this.openEditPlayedMatchModal(matchId);
    if(state == "upcoming") this.openEditUpcomingMatchModal(matchId);
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

    this.reload.emit();
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

    this.reload.emit();
  }
}