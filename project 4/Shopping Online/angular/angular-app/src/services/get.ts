import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';


// send a get request with the token if it exists
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  async getData(path: any, token: any): Promise<any> {
    const headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json');

      const obs = this.http.get(`api/${path}`, { headers });
      const res = await firstValueFrom(obs);
      return res;
  }
}