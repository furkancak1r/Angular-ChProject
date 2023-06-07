import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileService } from '../FileService/file.service';

@Injectable({
  providedIn: 'root',
})
export class ImageProcessingService {
  constructor(
    private fileService: FileService
  ) {}

  async processImage(image: any, otherDataForm: FormGroup) {
    let fileContent = '';
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear file path
      fileInput.files = null; // Clear files
    }

    // Get relevant form controls
    const widthControl = otherDataForm.get('width');
    const heightControl = otherDataForm.get('height');
    const horizontalLinesControl = otherDataForm.get('horizontalLines');
    const selectedAreaNumberControl = otherDataForm.get('selectedAreaNumber');
    const verticalLinesControl = otherDataForm.get('verticalLines');
    const verticalDistancesControl = otherDataForm.get('verticalDistances');
    const horizontalDistancesControl = otherDataForm.get('horizontalDistances');

    // Fill form controls with image data
    widthControl?.patchValue(image.width);
    heightControl?.patchValue(image.height);
    horizontalLinesControl?.patchValue(image.horizontalLines);
    selectedAreaNumberControl?.patchValue(image.selectedAreaNumber);
    verticalLinesControl?.patchValue(image.verticalLines);

    for (let i = 0; i < image.horizontalDistances.length; i++) {
      const distanceControl = horizontalDistancesControl?.get('distance_' + i);
      if (distanceControl) {
        distanceControl.setValue(image.horizontalDistances[i]);
      }
    }

    for (let i = 0; i < image.verticalDistances.length; i++) {
      const distanceControl = verticalDistancesControl?.get('distance_' + i);
      if (distanceControl) {
        distanceControl.setValue(image.verticalDistances[i]);
      }
    }

    const data = await this.fileService.getFile(image.fileName);
    if (data) {
      fileContent = data;
    }
    const element = document.getElementById('isImageUploaded');
    if (element) {
      element.classList.remove('hidden');
    }
    const filecontent = fileContent;
    const fileName = image.fileName;
    return {filecontent,fileName};
  }
}
