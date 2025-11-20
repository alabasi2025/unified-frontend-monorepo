import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements OnInit {
  @Input() appAutofocus = true;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.appAutofocus) {
      setTimeout(() => {
        this.elementRef.nativeElement.focus();
      }, 100);
    }
  }
}
