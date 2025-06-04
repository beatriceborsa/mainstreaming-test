import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, timer, switchMap, map, tap, catchError, shareReplay, of, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = 'assets/library.json';

  public contents$ = defer(() => {

    const lastFetch = parseInt(localStorage.getItem('lastFetch') || '0', 10);
    const now = Date.now();
    const elapsed = now - lastFetch;


    const delay = lastFetch ? Math.max(60000 - elapsed, 0) : 0;

    return timer(delay, 60000).pipe(
      switchMap(() =>
        this.http.get<any>(this.apiUrl).pipe(
          map(res => res?.data?.contents || []),
          tap(contents => {

            localStorage.setItem('lastFetch', Date.now().toString());

            localStorage.setItem('cachedData', JSON.stringify(contents));
            console.log('[FETCH] ultima fetch', new Date().toLocaleTimeString());
          }),
          catchError(err => {
            console.error('Errore nella fetch:', err);
            return of([]);
          })
        )
      ),
      shareReplay(1)
    );
  });

  constructor(private http: HttpClient) {}
}
