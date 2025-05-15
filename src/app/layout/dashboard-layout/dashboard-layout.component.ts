// dashboard-layout.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']  // styleUrl emas, styleUrls bo'lishi kerak
})
export class DashboardLayoutComponent implements OnInit {
  userRole: string = '';
  isDarkMode: boolean = false;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    const savedMode = localStorage.getItem('isDarkMode');
    this.isDarkMode = savedMode === 'true';
    this.applyTheme();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', String(this.isDarkMode));
    this.applyTheme();
  }

  applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      this.renderer.addClass(body, 'dark-mode');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
    }
    
    console.log('Dark mode:', this.isDarkMode);
    console.log('Body classes:', body.className);
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }
}