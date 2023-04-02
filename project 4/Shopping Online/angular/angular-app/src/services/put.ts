import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// send a put request with the token if it exists
@Injectable({
  providedIn: 'root'
})
export class PutData {

  constructor(private http: HttpClient) { }

  putData(path: string, data: any, token?: any): Observable<any> {
    if (token) {
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'multipart/form-data');

      return this.http.put(`api/${path}`, data, { headers });
    }

    return this.http.put(`api/${path}`, data);
  }
}