import { TestBed } from '@angular/core/testing';

import { ImageDeleteService } from './image-delete.service';

describe('ImageDeleteService', () => {
  let service: ImageDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
