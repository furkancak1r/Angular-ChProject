import { TestBed } from '@angular/core/testing';

import { Base64ToFileService } from './base64-to-file.service';

describe('Base64ToFileService', () => {
  let service: Base64ToFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Base64ToFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
