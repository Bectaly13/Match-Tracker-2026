import { Component, OnInit, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StorageService } from 'src/app/services/storage';
import { Match, Team } from 'src/app/services/database';

@Component({
  selector: 'app-edit-played-match',
  templateUrl: './edit-played-match.component.html',
  styleUrls: ['./edit-played-match.component.scss'],
  imports: [FormsModule]
})
export class EditPlayedMatchComponent implements OnInit {
  matchId = input.required<number>();
  close = output<any>();

  match!: Match;

  type: string = "";

  teams: Team[] = [];
  newTeam1Id!: number;
  newTeam1Score!: number;
  newTeam1ExtraScore!: number;
  newTeam2Id!: number;
  newTeam2Score!: number;
  newTeam2ExtraScore!: number;
  channels: string[] = [];

  newChannel: string = "";
  newNote: string = "";

  newState!: boolean;

  constructor(
    private storage: StorageService
  ) { }

  async ngOnInit() {
    this.channels = await this.storage.get("channels");
    
    const db = await this.storage.get("db");
    this.match = db.matches.find((m: Match) => m.id == this.matchId());
    this.teams = [...db.teams].sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    );

    this.type = this.match.type;

    this.newTeam1Id = this.match.id_team_1;
    this.newTeam1Score = this.match.score_team_1;
    this.newTeam1ExtraScore = this.match.extra_score_team_1;
    this.newTeam2Id = this.match.id_team_2;
    this.newTeam2Score = this.match.score_team_2;
    this.newTeam2ExtraScore = this.match.extra_score_team_2;

    this.newChannel = this.match.channel;
    this.newNote = this.match.note;

    this.newState = this.match.played;
  }

  save() {
    if(this.newTeam1Id === this.newTeam2Id && this.newTeam1Id != 0) {
      alert("Les deux équipes ne peuvent pas être identiques.");
      return;
    }

    const score1 = Number(this.newTeam1Score);
    const extraScore1 = Number(this.newTeam1ExtraScore);
    const score2 = Number(this.newTeam2Score);
    const extraScore2 = Number(this.newTeam2ExtraScore);

    if (
      this.newTeam1Score === null ||
      this.newTeam1ExtraScore === null ||
      this.newTeam2Score === null ||
      this.newTeam2ExtraScore === null ||
      isNaN(score1) ||
      isNaN(extraScore1) ||
      isNaN(score2) ||
      isNaN(extraScore2) ||
      !Number.isInteger(score1) ||
      !Number.isInteger(extraScore1) ||
      !Number.isInteger(score2) ||
      !Number.isInteger(extraScore2) ||
      score1 < 0 ||
      extraScore1 < 0 ||
      score2 < 0 ||
      extraScore2 < 0
    ) {
      alert("Les scores doivent être des entiers positifs.");
      return;
    }

    if(!this.newNote || !this.newNote.trim()) this.newNote = "-";

    this.close.emit({
      matchId: this.matchId(),
      newTeam1Id: this.newTeam1Id,
      newTeam1Score: score1,
      newTeam1ExtraScore: extraScore1,
      newTeam2Id: this.newTeam2Id,
      newTeam2Score: score2,
      newTeam2ExtraScore: extraScore2,
      newChannel: this.newChannel,
      newNote: this.newNote,
      newState: this.newState
    });
  }

  cancel() {
    this.close.emit(undefined);
  }
}
