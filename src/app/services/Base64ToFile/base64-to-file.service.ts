import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Base64ToFileService {

  base64ToFile(base64Content: string, fileName: string): File {
    const base64Data = base64Content.replace(/^data:[a-z\/]+;base64,/, '');
    const binaryData = this.base64ToBinary(base64Data);
    return new File([binaryData], fileName);
  }

  private base64ToBinary(base64Data: string): ArrayBuffer {
    const byteCharacters = atob(base64Data);
    const byteArrays: number[] = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    return new Uint8Array(byteArrays);
  }
}
