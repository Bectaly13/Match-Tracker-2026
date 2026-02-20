import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonIcon]
})
export class HeaderComponent {
  title = input.required<string>();
  backPath = input<string>("");

  constructor(
    private router: Router
  ) {
    addIcons({
      arrowBackOutline
    });
  }

  redirect() {
    this.router.navigate([this.backPath()]);
  }
}
