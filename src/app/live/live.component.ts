import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  bufferToggle,
  catchError,
  EMPTY,
  filter,
  finalize,
  groupBy,
  interval,
  map,
  mergeMap,
  Subject,
  switchMap,
  throttleTime
} from 'rxjs';

import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, PonyComponent, FromNowPipe, NgbAlert],
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveComponent {
  raceModel: RaceModel | null = null;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  error = false;
  winners: Array<PonyWithPositionModel> = [];
  betWon: boolean | null = null;
  clickSubject = new Subject<PonyWithPositionModel>();

  constructor(private ref: ChangeDetectorRef, private raceService: RaceService, private route: ActivatedRoute) {
    this.raceModel = this.route.snapshot.data['race'];

    if (this.raceModel!.status !== 'FINISHED') {
      this.raceService
        .live(this.raceModel!.id)
        .pipe(
          takeUntilDestroyed(),
          finalize(() => this.ref.markForCheck())
        )
        .subscribe({
          next: positions => {
            this.poniesWithPosition = positions;
            this.raceModel!.status = 'RUNNING';
            this.ref.markForCheck();
          },
          error: () => (this.error = true),
          complete: () => {
            this.raceModel!.status = 'FINISHED';
            this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
            this.betWon = this.winners.some(pony => pony.id === this.raceModel!.betPonyId);
          }
        });
    }

    this.clickSubject
      .pipe(
        groupBy(pony => pony.id, { element: pony => pony.id }),
        mergeMap(obs => obs.pipe(bufferToggle(obs, () => interval(1000)))),
        filter(array => array.length >= 5),
        throttleTime(1000),
        map(array => array[0]),
        switchMap(ponyId => this.raceService.boost(this.raceModel!.id, ponyId).pipe(catchError(() => EMPTY)))
      )
      .subscribe(() => {});
  }

  onClick(pony: PonyWithPositionModel): void {
    this.clickSubject.next(pony);
  }

  ponyById(index: number, pony: PonyWithPositionModel): number {
    return pony.id;
  }
}
