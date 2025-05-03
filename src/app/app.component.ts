// src/app/app.component.ts
import { Component } from '@angular/core';
import { AppLayoutComponent } from './shared/components/app-layout.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [AppLayoutComponent],
  template: ` <app-layout></app-layout> `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class AppComponent {}
