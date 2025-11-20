import { Directive, EventEmitter, HostListener, Input, Output, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounce]',
  standalone: true
})
export class DebounceDirective implements OnDestroy {
  @Input() debounceTime = 300;
  @Output() debounceClick = new EventEmitter();
  
  private clicks = new Subject();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.clicks
      .pipe(debounceTime(this.debounceTime))
      .subscribe(e => this.debounceClick.emit(e));
  }

  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
