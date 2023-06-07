import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { environment } from 'src/environments/environment.development';
import { WsService } from './ws.service';
import { MoneyHistoryModel } from './models/money-history.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly url = environment.baseUrl;

  userEvents: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient, private wsService: WsService) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = {
      login: login,
      password: password,
      birthYear: birthYear
    };
    return this.http.post<UserModel>(`${this.url}/api/users`, body);
  }

  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.url}/api/users/authentication`, credentials).pipe(tap(user => this.storeLoggedInUser(user)));
  }

  storeLoggedInUser(user: UserModel): void {
    localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }

  logout(): void {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
  }

  retrieveUser(): void {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.userEvents.next(user);
    }
  }

  getCurrentUser(): UserModel | null {
    return this.userEvents.getValue();
  }

  scoreUpdates(userId: number): Observable<UserModel> {
    return this.wsService.connect<UserModel>(`/player/${userId}`);
  }

  getMoneyHistory(): Observable<MoneyHistoryModel[]> {
    return this.http.get<MoneyHistoryModel[]>(`${environment.baseUrl}/api/money/history`);
  }
}
