import {inject, Injectable, makeStateKey, PLATFORM_ID, TransferState} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Course} from '../model/course';
import {Observable, of} from 'rxjs';
import {CoursesService} from './courses.service';
import {first, tap} from 'rxjs/operators';
import {isPlatformServer} from '@angular/common';


@Injectable()
export class CourseResolver implements Resolve<Course> {

  private coursesService = inject(CoursesService);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
        const courseId = route.params['id'];
        const COURSE_KEY = makeStateKey<Course>('courseKey ' + courseId);

        if (this.transferState.hasKey(COURSE_KEY)) {
          const course = this.transferState.get(COURSE_KEY, null);
          this.transferState.remove(COURSE_KEY);
          return of(course);

        } else {
          return this.coursesService.findCourseById(courseId)
            .pipe(
              first(),
              tap((course: Course) => {
                if (isPlatformServer(this.platformId)) {
                  this.transferState.set(COURSE_KEY, course);
                }
              })
            );
        }

    }

}
