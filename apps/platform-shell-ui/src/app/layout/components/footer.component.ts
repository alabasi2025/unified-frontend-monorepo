import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="layout-footer">
      <div class="footer-content">
        <div class="footer-text">
          <span>© {{ currentYear }} SEMOP - نظام إدارة المؤسسات الشامل</span>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">الدعم الفني</a>
          <span class="separator">|</span>
          <a href="#" class="footer-link">سياسة الخصوصية</a>
          <span class="separator">|</span>
          <a href="#" class="footer-link">شروط الاستخدام</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .layout-footer {
      padding: 1.5rem 2rem;
      background: white;
      border-top: 1px solid var(--surface-border);
      margin-top: auto;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-text {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .footer-link {
      color: var(--text-color-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: var(--primary-color);
    }

    .separator {
      color: var(--surface-border);
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        text-align: center;
      }

      .layout-footer {
        padding: 1rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
