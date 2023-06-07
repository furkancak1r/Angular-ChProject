import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fabric } from 'fabric';
import { ImageService } from '../services/ImageService/image.service';
import { Buffer } from 'buffer';
import { DrawingService } from '../services/DrawRectangleService/draw-rectangle.service';
import { SendToServerService } from '../services/SendToServerService/send-to-server.service';
import { ImageProcessingService } from '../services/ImageProcessing/image-processing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  otherDataForm: FormGroup;
  images: any[] = [];
  fabricCanvas: fabric.Canvas | null = null;
  file!: File; // File tipinde bir de
  imageBase64!: string;
  fileContent!: string;
  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private drawingService: DrawingService,
    private sendToServerService: SendToServerService,
    private imageProcessingService: ImageProcessingService
  ) {
    this.otherDataForm = this.formBuilder.group({
      width: Number,
      height: Number,
      horizontalLines: [0],
      verticalLines: [0],
      selectedAreaNumber: Number,
      horizontalDistances: this.formBuilder.group({}),
      verticalDistances: this.formBuilder.group({}),
    });
  }

  ngOnInit(): void {
    this.addMaxValueListeners('width', 1000);
    this.addMaxValueListeners('height', 1000);
    this.addMaxValueListeners('horizontalLines', 1000);
    this.addMaxValueListeners('verticalLines', 1000);

    // Subscribe to valueChanges observable of horizontalLines form control
    this.otherDataForm
      .get('horizontalLines')
      ?.valueChanges.subscribe((value) => {
        this.addHorizontalDistances(value);
      });

    // Subscribe to valueChanges observable of verticalLines form control
    this.otherDataForm.get('verticalLines')?.valueChanges.subscribe((value) => {
      this.addVerticalDistances(value);
    });

    // Subscribe to valueChanges observable of otherDataForm and call drawRectangle() method when any value changes.
    this.otherDataForm.valueChanges.subscribe(() => {
      this.drawRectangle();
    });
  }

  createHorizontalDistancesControls(count: number) {
    const horizontalDistancesForm = this.otherDataForm.get(
      'horizontalDistances'
    ) as FormGroup;

    // Mevcut alanları temizle
    Object.keys(horizontalDistancesForm.controls).forEach((key) => {
      horizontalDistancesForm.removeControl(key);
    });

    for (let i = 0; i < count; i++) {
      horizontalDistancesForm.addControl(
        'distance_' + i,
        new FormControl(null)
      );
    }
  }

  createVerticalDistancesControls(count: number) {
    const verticalDistancesForm = this.otherDataForm.get(
      'verticalDistances'
    ) as FormGroup;

    // Mevcut alanları temizle
    Object.keys(verticalDistancesForm.controls).forEach((key) => {
      verticalDistancesForm.removeControl(key);
    });

    for (let i = 0; i < count; i++) {
      verticalDistancesForm.addControl('distance_' + i, new FormControl(null));
    }
  }

  loadImages() {
    const table = document.getElementById('table');
    table?.classList.remove('hidden');

    this.imageService.getImages().subscribe(
      (data) => {
        this.images = data;
        console.log(this.images);
        // Sayfayı 100 piksel aşağı kaydır
        // Sayfanın en altına git
        // Sayfa yüklendikten sonra çalışacak kod
        // Belirli bir süre sonra kaydırma işlemini gerçekleştir
        setTimeout(function () {
          // Sayfanın en altına kaydır
          window.scrollTo(0, document.body.scrollHeight);
        }, 1000); // 1 saniye bekleme süresi
      },
      (error) => {
        console.error('Veri alma hatası:', error);
      }
    );
  }

  // Fonksiyonu bileşeninizin içerisinde uygun bir yerde tanımlayın
  async get(image: any) {
    const result = await this.imageProcessingService.processImage(
      image,
      this.otherDataForm
    );

    const filecontent = result.filecontent;
    const fileName = result.fileName;

    // Call drawRectangle() method to update the canvas
    this.base64ToFile(filecontent, fileName);
    this.drawRectangle();

  }


  addMaxValueListeners(controlName: string, maxValue: number) {
    this.otherDataForm.get(controlName)?.valueChanges.subscribe((value) => {
      if (value > maxValue) {
        this.otherDataForm.patchValue({ [controlName]: maxValue });
      }
    });
  }

  ngAfterViewInit(): void {
    // Set initial size of canvas element.
    const canvas = this.canvas.nativeElement;
    canvas.width = 800;
    canvas.height = 600;
    let width = this.otherDataForm.value.width;
    let height = this.otherDataForm.value.height;
    // Create a new fabric.Canvas instance and set its dimensions
    const canvasElement = this.canvas.nativeElement;
    this.fabricCanvas = new fabric.Canvas(canvasElement);
    this.fabricCanvas.setDimensions({
      width: canvas.width,
      height: canvas.height,
    });

    // Set a minimum scale value
    const minScale = 0.5;

    // Calculate the scale factor based on the desired width and height of the rectangle
    let scale = Math.min(canvas.width / width, canvas.height / height);

    // Ensure that the scale factor is not less than the minimum scale value
    scale = Math.max(minScale, scale);

    // Scale the canvas using the fabric.Canvas.setZoom() method
    this.fabricCanvas.setZoom(scale);
  }

  onSubmit(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Reset the form
    this.otherDataForm.reset();
  }

  getLinesArray(lineCount: number): number[] {
    return Array(lineCount)
      .fill(0)
      .map((_, index) => index + 1);
  }
  addHorizontalDistances(count: number) {
    const horizontalDistancesForm = this.otherDataForm.get(
      'horizontalDistances'
    ) as FormGroup;
    const controls = horizontalDistancesForm.controls;
    Object.keys(controls).forEach((key) => {
      horizontalDistancesForm.removeControl(key);
    });

    for (let i = 0; i < count; i++) {
      horizontalDistancesForm.addControl(
        'distance_' + i,
        new FormControl(null)
      );
    }
  }

  addVerticalDistances(count: number) {
    const verticalDistancesForm = this.otherDataForm.get(
      'verticalDistances'
    ) as FormGroup;
    const controls = verticalDistancesForm.controls;
    Object.keys(controls).forEach((key) => {
      verticalDistancesForm.removeControl(key);
    });

    for (let i = 0; i < count; i++) {
      verticalDistancesForm.addControl('distance_' + i, new FormControl(null));
    }
  }
  base64ToFile(base64Content: string, fileName: string) {
    const base64Data = base64Content.replace(/^data:[a-z\/]+;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');
    const file = new File([binaryData], fileName);

    // Bir DataTransferItemList nesnesi oluşturun
    const dt = new DataTransfer();

    // DataTransferItemList'e file nesnesini ekleyin
    dt.items.add(file);

    // DataTransferItemList'den bir FileList nesnesi alın
    const fileList = dt.files;
    const input = document.getElementById('imageUpload') as HTMLInputElement;

    // Input file'ın files özelliğini FileList ile değiştirin
    if (input) {
      input.files = fileList;
    }
  }

  drawRectangle(): void {
    const canvas = this.canvas.nativeElement;

    this.drawingService.drawRectangle(this.otherDataForm, canvas);
  }
  fileChangeEvent = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      this.file = file;

      // Dosyayı base64 formatına dönüştürme fonksiyonunu çağır
      const fileBase64 = await this.readFileAsBase64(file);

      // Base64 formatındaki dosyayı this.imageBase64'e eşitle
      this.imageBase64 = fileBase64;

      const element = document.getElementById('isImageUploaded');
      if (element) {
        element.classList.remove('hidden');
      }
    }
  };

  // Dosyayı base64 formatına dönüştürme fonksiyonu
  readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const fileBase64 = base64String.split(',')[1]; // Base64 veri kısmını al
        resolve(fileBase64);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  // Diğer kodlar...
  sendToServer = async () => {
    await this.sendToServerService.sendToServer(
      this.file,
      this.imageBase64,
      this.otherDataForm
    );
  };

  get horizontalDistances() {
    return this.otherDataForm.get('horizontalDistances') as FormGroup;
  }

  get verticalDistances() {
    return this.otherDataForm.get('verticalDistances') as FormGroup;
  }
  parseInt(value: string): number {
    return parseInt(value, 10);
  }
}
