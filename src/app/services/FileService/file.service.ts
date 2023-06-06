import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://localhost:3000/api_chproject';

  constructor(private http: HttpClient) {}

  async getFile(fileName: string) {
    try {
      const response = await this.http.get(`${this.baseUrl}/get/file/${fileName}`, { responseType: 'text' }).toPromise();
      return response;
    } catch (error) {
      // Hata yönetimi burada yapılabilir
      console.error('Dosya alınamadı:', error);
      throw error;
    }
  }
}
