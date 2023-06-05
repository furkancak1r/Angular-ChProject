import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'https://furkancakr.online/api_chproject/images';

  constructor(private http: HttpClient) { }

  getImages(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
