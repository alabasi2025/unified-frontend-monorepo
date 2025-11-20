import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective implements OnInit {
  @Input() appRole: string | string[] = '';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const roles = Array.isArray(this.appRole) ? this.appRole : [this.appRole];
    const hasRole = roles.some(r => this.authService.hasRole(r));

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
