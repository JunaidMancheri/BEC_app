import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterModule,
} from '@angular/router';
import { environment } from '../../../environments/environment';
import { Post } from '../post.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [RouterModule, MatCardModule, SharedModule, MatDividerModule],
  templateUrl: './single-post.component.html',
  styles: `
  `,
})
export class SinglePostComponent implements OnInit {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);

  data: Post = {} as Post;

  ngOnInit(): void {
    this.http
      .get<{data: Post}>(environment.baseUrl + '/posts/' + this.route.snapshot.url)
      .subscribe((res) => {
        this.data = res.data;
      });
  }
}
