import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, takeWhile } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { PonyWithPositionModel } from './models/pony.model';
import { LiveRaceModel, RaceModel } from './models/race.model';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private readonly url = environment.baseUrl;

  constructor(private http: HttpClient, private wsService: WsService) {}

  list(status: 'PENDING' | 'RUNNING' | 'FINISHED'): Observable<Array<RaceModel>> {
    const params = { status };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
  }

  bet(raceId: number, ponyId: number): Observable<RaceModel> {
    return this.http.post<RaceModel>(`${this.url}/api/races/${raceId}/bets`, { ponyId });
  }

  get(id: number): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${this.url}/api/races/${id}`);
  }

  cancelBet(raceId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/api/races/${raceId}/bets`);
  }

  live(raceId: number): Observable<Array<PonyWithPositionModel>> {
    return this.wsService.connect<LiveRaceModel>(`/race/${raceId}`).pipe(
      takeWhile(liveRace => liveRace.status !== 'FINISHED'),
      map(liveRace => liveRace.ponies)
    );
  }

  boost(raceId: number, ponyId: number): Observable<void> {
    return this.http.post<void>(`${this.url}/api/races/${raceId}/boosts`, { ponyId });
  }
}
