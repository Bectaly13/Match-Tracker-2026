import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-button',
  templateUrl: './group-button.component.html',
  styleUrls: ['./group-button.component.scss'],
})
export class GroupButtonComponent {
  groupName = input.required<string>();
  teams = input.required<string[]>();

  constructor(
    private router: Router
  ) { }

  redirect() {
    this.router.navigate(["group/",  this.groupName()]);
  }
}
