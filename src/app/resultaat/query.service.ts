import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IQueryResponse } from '../app';


@Injectable({
  providedIn: 'root'
})
export class QueryService {
  constructor(private http: HttpClient) { 

  }

  public fetch(rq: string) {
    let data = new FormData(); 
    data.set('query', rq);
    return this.http.post<IQueryResponse>(
      environment.sparqlEndpoint,
      rq
    );
  }
}
