import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from './models/hero';
import { Villain } from './models/villain';
import { Result } from './models/result';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly baseUrl: string = 'http://danield26.somee.com/api/'
  constructor(private _http: HttpClient) { }

  getAllHeroes(): Observable<Hero[]> {
    const url = this.baseUrl + "hero"

    return this._http.get<Hero[]>(url);
  }

  getAllVillains(): Observable<Villain[]> {
    const url = this.baseUrl + "villain"

    return this._http.get<Villain[]>(url);
  }

  getResults(): Observable<Result[]> {
    const url = this.baseUrl + "game"

    return this._http.get<Result[]>(url);
  }

  postResults(result): Observable<Result> {
    return this._http.post<Result>(this.baseUrl + "game", result);
  }

}

