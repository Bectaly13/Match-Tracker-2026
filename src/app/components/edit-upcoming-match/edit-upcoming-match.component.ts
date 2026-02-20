import { Component, OnInit, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StorageService } from 'src/app/services/storage';
import { Match, Team } from 'src/app/services/database';

@Component({
  selector: 'app-edit-upcoming-match',
  templateUrl: './edit-upcoming-match.component.html',
  styleUrls: ['./edit-upcoming-match.component.scss'],
  imports: [FormsModule]
})
export class EditUpcomingMatchComponent implements OnInit {
  matchId = input.required<number>();
  close = output<any>();

  match!: Match;

  teams: Team[] = [];
  newTeam1Id!: number;
  newTeam2Id!: number;
  channels: string[] = [];

  newChannel: string = "";
  newNote: string = "";

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

    this.newTeam1Id = this.match.id_team_1;
    this.newTeam2Id = this.match.id_team_2;

    this.newChannel = this.match.channel;
    this.newNote = this.match.note;
  }

  save() {
    if (this.newTeam1Id === this.newTeam2Id && this.newTeam1Id != 0) {
      alert("Les deux équipes ne peuvent pas être identiques.");
      return;
    }

    let newNote: string = "-";
    if(!this.newNote.trim()) this.newNote = newNote;

    this.close.emit({
      matchId: this.matchId(),
      newTeam1Id: this.newTeam1Id,
      newTeam2Id: this.newTeam2Id,
      newChannel: this.newChannel,
      newNote: this.newNote
    });
  }

  cancel() {
    this.close.emit(undefined);
  }
}
