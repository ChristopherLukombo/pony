import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pr-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() dismissible = true;
  @Input() type = 'warning';
  @Output() readonly closed = new EventEmitter<void>();

  closeHandler(): void {
    this.closed.emit();
  }

  get alertClasses(): string {
    return `alert ${this.dismissible ? 'alert-dismissible' : ''} alert-${this.type}`;
  }
}
