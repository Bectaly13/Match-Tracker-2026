import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss'],
  imports: [FormsModule]
})
export class AddChannelComponent {
  channelName: string = "";

  close = output<string | undefined>();

  constructor() { }

  cancel() {
    this.close.emit(undefined);
  }

  confirm() {
    const value = this.channelName.trim();
    if(!value) return;

    this.close.emit(value);
  }
}
