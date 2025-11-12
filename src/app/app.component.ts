import {Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AppShellRenderDirective} from "./directives/app-shell-render.directive";

// todo: "prerender": "http-server -c-1 dist/angular-ssr-course/browser",

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MatListModule, RouterLink, MatIconModule, MatToolbarModule, MatButtonModule, RouterOutlet, MatSidenavModule, MatProgressSpinner, AppShellRenderDirective]
})
export class AppComponent {


}
