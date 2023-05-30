import { TestBed } from '@angular/core/testing';

import { DrawRectangleService } from './draw-rectangle.service';

describe('DrawRectangleService', () => {
  let service: DrawRectangleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawRectangleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
