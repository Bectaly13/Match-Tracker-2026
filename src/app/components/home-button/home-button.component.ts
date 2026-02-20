import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss'],
})
export class HomeButtonComponent {
  title = input.required<string>();
  path = input.required<string>();

  constructor(
    private router: Router 
  ) { }

  redirect() {
    this.router.navigate([this.path()]);
  }
}