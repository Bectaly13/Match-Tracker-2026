import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { GroupButtonComponent } from 'src/app/components/group-button/group-button.component';

import { ThemeService } from 'src/app/services/theme';
import { StorageService } from 'src/app/services/storage';
import { Team } from 'src/app/services/database';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, GroupButtonComponent]
})
export class GroupsPage implements ViewWillEnter{
  groupNames: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  teams: Team[] = [];
  sortedTeams: Team[] = [];
  teamsOrganized: any = {};

  selectedTeam!: Team;

  async ionViewWillEnter() {
    await this.initTheme();
    await this.getTeams();
    this.getSortedTeams();
  }

  constructor(
    private theme: ThemeService,
    private storage: StorageService,
    private router: Router
  ) { }

  async initTheme() {
    await this.theme.initTheme();
  }

  async getTeams() {
    const db = await this.storage.get("db");
    this.teams = db.teams;

    for(let groupName of this.groupNames) {
      this.teamsOrganized[groupName] = [];
    }

    for(let team of this.teams) {
      if(team.id != 0) {
        this.teamsOrganized[team.group_name].push(team.name);
      }
    }
  }

  getSortedTeams() {
    this.sortedTeams = this.teams.sort((a: Team, b: Team) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
  }

  goToGroup(team: Team) {
    this.router.navigate(["group/", team.group_name]);
  }
}
