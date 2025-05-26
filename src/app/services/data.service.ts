import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, startWith, switchMap, shareReplay, map } from 'rxjs';
import { Content } from '../model/content.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'assets/library.json';

  public contents$ = interval(60000).pipe(
    startWith(0),
    switchMap(() =>
      this.http.get<any>(this.apiUrl).pipe(
        map(response => response?.data?.contents || [])
      )
    ),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}
}
