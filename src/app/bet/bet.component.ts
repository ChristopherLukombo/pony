import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FromNowPipe } from '../from-now.pipe';
import { PonyModel } from '../models/pony.model';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { RaceService } from '../race.service';
import { AlertComponent } from '../alert/alert.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-bet',
  standalone: true,
  imports: [CommonModule, PonyComponent, FromNowPipe, RouterLink, AlertComponent, NgbAlert],
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent {
  raceModel!: RaceModel;
  betFailed = false;

  constructor(private raceService: RaceService, private route: ActivatedRoute) {
    this.raceModel = this.route.snapshot.data['race'];
  }

  betOnPony(pony: PonyModel): void {
    if (!this.isPonySelected(pony)) {
      this.raceService.bet(this.raceModel!.id, pony.id).subscribe({
        next: race => (this.raceModel = race),
        error: () => (this.betFailed = true)
      });
    } else {
      this.raceService.cancelBet(this.raceModel!.id).subscribe({
        next: () => (this.raceModel!.betPonyId = undefined),
        error: () => (this.betFailed = true)
      });
    }
  }

  isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel!.betPonyId;
  }
}
