import {Component, inject, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {Observable} from "rxjs";
import {CoursesService} from "../services/courses.service";
import {map} from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import {Title} from "@angular/platform-browser";
import {AppShellNoRenderDirective} from "../directives/app-shell-norender.directive";

@Component({
    selector: 'home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [MatTabsModule, CoursesCardListComponent, AsyncPipe, AppShellNoRenderDirective]
})
export class HomeComponent implements OnInit {

    protected courses$: Observable<Course[]>;
    private readonly coursesService = inject(CoursesService);
    private readonly title = inject(Title);

    ngOnInit() {
      this.title.setTitle('New Angular Title - SSR')
      this.courses$ = this.coursesService.findAllCourses().pipe(map(Object.values));
    }

}
