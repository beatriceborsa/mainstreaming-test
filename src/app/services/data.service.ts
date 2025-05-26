import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, startWith, switchMap, shareReplay } from 'rxjs';
import { Content } from '../model/content.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'https://firebasestorage.googleapis.com/v0/b/testmainstreaming.appspot.com/o/library.json?alt=media&token=6fe008b7-5bab-4acd-bee1-a306649dc74f';

  public contents$ = interval(60000).pipe(
    startWith(0),
    switchMap(() => this.http.get<Content[]>(this.url)),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}
}
