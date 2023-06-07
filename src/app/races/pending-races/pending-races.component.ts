import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RaceComponent } from '../../race/race.component';
import { RaceModel } from '../../models/race.model';

@Component({
  standalone: true,
  imports: [NgFor, RouterLink, RaceComponent],
  templateUrl: './pending-races.component.html',
  styleUrls: ['./pending-races.component.css']
})
export class PendingRacesComponent {
  races: RaceModel[];

  constructor(route: ActivatedRoute) {
    this.races = route.snapshot.data['races'];
  }
}
