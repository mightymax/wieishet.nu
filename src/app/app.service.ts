import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as App from './app';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private persoonSource = new BehaviorSubject(new App.Persoon());
  persoon = this.persoonSource.asObservable();

  constructor(private http: HttpClient) { 

  }

  changePersoon(persoon: App.Persoon) {
    this.persoonSource.next(persoon)
  }

  public count(persoon?: App.Persoon)
  {
    if (!persoon) persoon = this.persoonSource.value
    let body = new URLSearchParams();
    body.set('query', persoon.countQuery());
    return this.http.post<App.IQueryResponseCount>(
      environment.sparqlEndpoint,
      body.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  public fetch(query: string | undefined = "") {
    let body = new URLSearchParams();
    body.set('query', query ? query : this.persoonSource.value.sparql());
    return this.http.post<App.IQueryResponse>(
      environment.sparqlEndpoint,
      body.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

}
