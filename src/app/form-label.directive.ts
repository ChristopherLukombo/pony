import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[prFormLabel]',
  standalone: true
})
export class FormLabelDirective {
  @HostBinding('class.text-danger') isInvalid: boolean | null = false;
}
