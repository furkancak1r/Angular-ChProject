import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageDeleteService {
  private apiUrl = 'http://localhost:3000/api_chproject/delete/image/';

  constructor(private http: HttpClient) { }

  deleteImage(fileName: string): Observable<any> {
    const url = this.apiUrl + fileName;
    return this.http.delete(url);
  }
}
