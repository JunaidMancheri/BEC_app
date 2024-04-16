import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  collapsed = signal(true);
  sidenavWidth = computed(() => this.collapsed() ? '3.6rem' : '12rem')
  navItems = [
    {
      route: 'categories',
      title: 'Category',
      icon: 'category'
    },
    {
      route: 'amenities',
      title: 'Amenity',
      icon: 'menu_book'
    },
    {
      route: 'courses',
      title: 'Course',
      icon: 'auto_stories'
    }
  ]
}
