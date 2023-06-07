import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, SlicePipe } from '@angular/common';
import { RaceModel } from '../../models/race.model';
import { ActivatedRoute } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { RaceComponent } from '../../race/race.component';

@Component({
  standalone: true,
  imports: [NgFor, SlicePipe, NgbPagination, RaceComponent],
  templateUrl: './finished-races.component.html',
  styleUrls: ['./finished-races.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinishedRacesComponent {
  races: Array<RaceModel>;
  page = 1;

  constructor(route: ActivatedRoute) {
    this.races = route.snapshot.data['races'];
  }
}
