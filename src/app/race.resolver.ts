import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { RaceModel } from './models/race.model';
import { RaceService } from './race.service';

export const raceResolver: ResolveFn<RaceModel> = route => {
  const raceService = inject(RaceService);
  const raceId = parseInt(route.paramMap.get('raceId')!);
  return raceService.get(raceId);
};
