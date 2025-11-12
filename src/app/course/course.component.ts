import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {Course} from '../model/course';
import {CoursesService} from '../services/courses.service';
import {Lesson} from '../model/lesson';
import {Meta, Title} from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {AppShellRenderDirective} from "../directives/app-shell-render.directive";


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  standalone: true,
    imports: [MatProgressSpinnerModule, MatTableModule, AppShellRenderDirective]
})
export class CourseComponent implements OnInit {
    protected course: Course;
    protected dataSource: MatTableDataSource<Lesson>;
    protected displayedColumns= ["seqNo", "description", "duration"];

    protected readonly route = inject(ActivatedRoute);
    protected readonly coursesService = inject(CoursesService);
    protected readonly title = inject(Title);
    protected readonly meta = inject(Meta);

    ngOnInit() {
      this.course = this.route.snapshot.data["course"];
      this.title.setTitle(this.course.description);
      this.meta.updateTag({name: "description", content: this.course.longDescription});

      this.meta.addTag({name: 'twitter:card', content: 'summary'});
      this.meta.addTag({name: 'twitter:site', content: '@AngularUniv'});
      this.meta.addTag({name: 'twitter:title', content: this.course.description});
      this.meta.addTag({name: 'twitter:description', content: this.course.description});
      this.meta.addTag({name: 'twitter:text:description', content: this.course.description});
      this.meta.addTag({name: 'twitter:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200'});


      this.dataSource = new MatTableDataSource([]);

      this.coursesService.findAllCourseLessons(this.course.id)
        .subscribe(lessons => this.dataSource.data = lessons);
  }
}
