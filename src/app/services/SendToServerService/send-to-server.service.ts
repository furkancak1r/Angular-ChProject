import { Injectable } from '@angular/core';
import axios from 'axios';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SendToServerService {
  async sendToServer(
    event: Event,
    file: File,
    imageBase64: string,
    otherDataForm: FormGroup
  ): Promise<void> {
    // Girdi verilerini al
    const width =
      (document.getElementById('width') as HTMLInputElement)?.value || '';
    const height =
      (document.getElementById('height') as HTMLInputElement)?.value || '';
    const horizontalLines =
      (document.getElementById('horizontalLines') as HTMLInputElement)?.value ||
      '';
    const selectedAreaNumber =
      (document.getElementById('selectedAreaNumber') as HTMLInputElement)
        ?.value || '';
    const verticalLines =
      (document.getElementById('verticalLines') as HTMLInputElement)?.value ||
      '';

    if (!file) {
      console.log('sendToServerfile:', file);
      alert('Lütfen bir dosya seçin');
      return;
    }
    const fileName = file.name;

    // Dosyayı Base64 formatına dönüştür
    const fileBase64 = imageBase64;
    const horizontalDistances: string[] = [];
    const verticalDistances: string[] = [];

    // Yatay mesafeleri diziye ekle
    if (
      Number(horizontalLines) >= 0 &&
      otherDataForm?.get('horizontalDistances')
    ) {
      const horizontalDistancesForm = otherDataForm.get('horizontalDistances');
      if (horizontalDistancesForm instanceof FormGroup) {
        const distanceControls = Object.keys(horizontalDistancesForm.controls);
        for (let i = 0; i < distanceControls.length; i++) {
          const distanceControl = horizontalDistancesForm.get('distance_' + i);
          if (distanceControl) {
            horizontalDistances.push(distanceControl.value);
          }
        }
      }
    }

    // Dikey mesafeleri diziye ekle
    if (
      Number(verticalLines) >= 0 &&
      otherDataForm?.get('verticalDistances')
    ) {
      const verticalDistancesForm = otherDataForm.get('verticalDistances');
      if (verticalDistancesForm instanceof FormGroup) {
        const distanceControls = Object.keys(verticalDistancesForm.controls);
        for (let i = 0; i < distanceControls.length; i++) {
          const distanceControl = verticalDistancesForm.get('distance_' + i);
          if (distanceControl) {
            verticalDistances.push(distanceControl.value);
          }
        }
      }
    }

    // Sunucuya post isteği gönder
    try {
      const response = await axios.post(
        'http://localhost:3000/api_chproject/post/images',
        {
          fileName,
          width,
          height,
          horizontalLines,
          selectedAreaNumber,
          verticalLines,
          fileBase64,
          horizontalDistances,
          verticalDistances,
        }
      );
      console.log('Veri sunucuya gönderildi:', response.data);
      alert('Veriler başarıyla kaydedildi');
    } catch (error) {
      console.error('Sunucuya veri gönderme hatası:', error);
      alert('Kaydederken sorun oluştu');
    }
  }
}
