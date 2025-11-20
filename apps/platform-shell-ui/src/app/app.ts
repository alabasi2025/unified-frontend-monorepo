import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.scss',
})
export class App {
  title = 'SEMOP - Shared Enterprise Management Operations Platform';
}
