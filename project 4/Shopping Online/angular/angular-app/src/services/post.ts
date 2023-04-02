import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


// send a post request with the token if it exists
@Injectable({
  providedIn: 'root'
})
export class PostData {

  constructor(private http: HttpClient) { }

  postData(path: string, data: any, token?: any): Observable<any> {
    if (token) {
        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'multipart/form-data');

      return this.http.post(`api/${path}`, JSON.stringify(data), { headers });
    }

    return this.http.post(`api/${path}`, data);
  }
}




