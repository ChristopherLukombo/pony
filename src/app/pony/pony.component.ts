import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  standalone: true,
  templateUrl: './pony.component.html',
  styleUrls: ['./pony.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PonyComponent {
  @Input({ required: true }) ponyModel!: PonyModel;
  @Input() isRunning = false;
  @Input() isBoosted: boolean | undefined = false;
  @Output() readonly ponyClicked = new EventEmitter<PonyModel>();

  getPonyImageUrl(): string {
    return `assets/images/pony-${this.ponyModel.color.toLowerCase()}${this.isBoosted ? '-rainbow' : this.isRunning ? '-running' : ''}.gif`;
  }

  clicked(): void {
    this.ponyClicked.emit(this.ponyModel);
  }
}
