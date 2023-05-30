import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RectangleDrawingService {
  drawRectangle(
    otherDataFormValue: any,
    canvas: HTMLCanvasElement,
    imageUploadInput: HTMLInputElement,
    selectedAreaNumberInput: HTMLInputElement | null
  ): void {
    let width = otherDataFormValue.width;
    let height = otherDataFormValue.height;
    const horizontalDistances = otherDataFormValue.horizontalDistances;
    const verticalDistances = otherDataFormValue.verticalDistances;
    if (!width || !height) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale down rectangle and text if necessary
    let scale = 1;
    if (width > canvas.width - 20 || height > canvas.height - 20) {
      scale = Math.max(
        0.1,
        Math.min((canvas.width - 20) / width, (canvas.height - 20) / height)
      );
      width *= scale;
      height *= scale;

      // Scale relative to center of canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / (2 * scale), -canvas.height / (2 * scale));
    }

    const offsetX = (canvas.width / scale - width) / 2;
    const offsetY = (canvas.height / scale - height) / 2;

    ctx.beginPath();
    ctx.rect(offsetX, offsetY, width, height);
    ctx.stroke();

    ctx.font = '16px sans-serif';

    // Ensure text stays within canvas
    let textWidth = ctx.measureText(`Width: ${width / scale}mm`).width;
    let textX = Math.min(
      width + 20 + offsetX,
      (canvas.width - textWidth - 10) / scale
    );

    // Position text next to bottom side of rectangle
    ctx.fillText(
      `Width: ${width / scale}mm`,
      width / (2 * scale) + offsetX - textWidth / 2,
      height + offsetY + 20
    );

    textWidth = ctx.measureText(`Height: ${height / scale}mm`).width;
    let textY = Math.min(
      height + 30 + offsetY - 10, // Decrease 10 pixels to add some space
      (canvas.height - textWidth - 10) / scale
    );

    // Position text next to right side of rectangle
    ctx.save(); // Save current canvas state

    // Rotate canvas 90 degrees clockwise
    ctx.translate(width + offsetX + 20, height / (2 * scale) + offsetY);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`Height: ${height / scale}mm`, 0, 0);

    ctx.restore(); // Restore canvas state

    // Oda numaralarının yazılacağı font ve renk
    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'black';

    // Yatay çizgilerin koordinatlarını tutan bir dizi
    const horizontalLines: number[] = [offsetY]; // Dikdörtgenin üst kenarını ekle

    // Dikey çizgilerin koordinatlarını tutan bir dizi
    const verticalLines: number[] = [offsetX]; // Dikdörtgenin sol kenarını ekle

    // Metni yatay olarak ortalamak için textAlign özelliğini "center" olarak ayarla
    ctx.textAlign = 'center';

    // Yatay çizgileri ve koordinatlarını çiz
    let currentY = offsetY;
    for (const key in horizontalDistances) {
      const distance = horizontalDistances[key];
      if (distance !== null) {
        currentY += distance;
        const isBeyondBounds = currentY > height + offsetY;
        ctx.beginPath();
        ctx.moveTo(offsetX, currentY);
        ctx.lineTo(width + offsetX, currentY);
        ctx.strokeStyle = isBeyondBounds ? 'red' : 'black';
        ctx.stroke();
        textWidth = ctx.measureText(`${distance}mm`).width;
        textX = Math.min(
          width + Math.max(20, textWidth) + offsetX,
          (canvas.width - textWidth - 10) / scale
        );
        ctx.fillStyle = isBeyondBounds ? 'red' : 'black';
        ctx.fillText(`${distance}mm`, textX, currentY);

        // Yatay çizginin y koordinatını diziye ekle
        horizontalLines.push(currentY);
      }
    }
    horizontalLines.push(height + offsetY); // Dikdörtgenin alt kenarını ekle

    // Dikey çizgileri ve koordinatlarını çiz
    let currentX = offsetX;
    for (const key in verticalDistances) {
      const distance = verticalDistances[key];
      if (distance !== null) {
        currentX += distance;
        const isBeyondBounds = currentX > width + offsetX;
        ctx.beginPath();
        ctx.moveTo(currentX, offsetY);
        ctx.lineTo(currentX, height + offsetY);
        ctx.strokeStyle = isBeyondBounds ? 'red' : 'black';
        ctx.stroke();
        textWidth = ctx.measureText(`${distance}mm`).width;
        textY = Math.min(
          height + Math.max(30, textWidth) + offsetY,
          (canvas.height - textWidth - 10) / scale
        );
        ctx.fillStyle = isBeyondBounds ? 'red' : 'black';

        // Position text below center of line
        ctx.fillText(
          `${distance}mm`,
          currentX - textWidth / 2,
          height + offsetY + 20
        );

        // Dikey çizginin x koordinatını diziye ekle
        verticalLines.push(currentX);
      }
    }
    verticalLines.push(width + offsetX); // Dikdörtgenin sağ kenarını ekle
    // Oda numaralarını al
    let selectedAreaNumber = selectedAreaNumberInput?.value;

    // Her oda için bir numara yaz
    let roomNumber = 1; // Oda numarasını tutan değişken
    let selectedAreaX = 0; // Seçilen oda numarasına ait x koordinatını tutan değişken
    let selectedAreaY = 0; // Seçilen oda numarasına ait y koordinatını tutan değişken
    let selectedAreaWidth = 0; // Seçilen oda numarasına ait genişliği tutan değişken
    let selectedAreaHeight = 0; // Seçilen oda numarasına ait yüksekliği tutan değişken
    for (let i = 0; i < horizontalLines.length - 1; i++) {
      // Son elemanı atla
      for (let j = 0; j < verticalLines.length - 1; j++) {
        // Son elemanı atla
        // Oda numarasını metin olarak al
        const number = roomNumber.toString();

        // Metnin genişliğini ve yüksekliğini ölç
        const textWidth = ctx.measureText(number).width;
        const textHeight = parseInt(ctx.font);

        // Metnin yazılacağı x ve y koordinatlarını hesapla
        // x koordinatı, dikey çizginin ortasına denk gelir
        // y koordinatı, yatay çizginin üzerine metnin yüksekliğinin yarısı kadar uzaklıkta olur

        // Eğer ilk satır veya sütun ise, dikdörtgenin kenarından başla
        let x =
          j === 0 ? offsetX + textWidth / 2 : verticalLines[j] + textWidth / 2;

        let y =
          i === horizontalLines.length - 1
            ? height + offsetY - textHeight / 2
            : horizontalLines[i] - textHeight / 2;

        // Oda genişliğini ve yüksekliğini hesapla
        const roomWidth = verticalLines[j + 1] - verticalLines[j];
        const roomHeight = horizontalLines[i + 1] - horizontalLines[i];
        // Eğer oda numarası seçilen oda numarasına eşitse, x ve y koordinatlarını ve genişlik ve yüksekliği kaydet
        if (number === selectedAreaNumber) {
          // selectedAreaX değerini dikey çizginin x koordinatı olarak ata
          selectedAreaX = verticalLines[j];
          // selectedAreaY değerini yatay çizginin y koordinatı olarak ata
          selectedAreaY = horizontalLines[i];
          selectedAreaWidth = roomWidth;
          selectedAreaHeight = roomHeight;
        }

        // Metnin x ve y koordinatlarına oda genişliğinin ve yüksekliğinin yarısını ekle
        x += roomWidth / 2;
        y += roomHeight / 2;

        // Metnin x ve y koordinatlarına küçük bir düzeltme faktörü ekle
        const correctionX = -2; // Bu değer değiştirilebilir
        const correctionY = 4; // Bu değer değiştirilebilir
        x += correctionX;
        y += correctionY;

        // Metni yaz
        ctx.fillText(number, x, y);

        // Upload edilen resmi canvas üzerine çiz
        const fileInput = document.getElementById(
          'imageUpload'
        ) as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const reader = new FileReader();

          reader.onload = () => {
            const image = new Image();
            image.onload = () => {
              // Draw the image on the canvas
              if (number === selectedAreaNumber) {
                ctx.drawImage(
                  image,
                  selectedAreaX,
                  selectedAreaY,
                  selectedAreaWidth,
                  selectedAreaHeight
                );
              }
            };

            // Set the source of the image to the loaded file
            image.src = reader.result as string;
          };

          // Read the selected file as a data URL
          reader.readAsDataURL(file);
        }

        roomNumber++;
      }
    }
  }
}
