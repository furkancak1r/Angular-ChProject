import { TestBed } from '@angular/core/testing';

import { SendToServerService } from './send-to-server.service';

describe('SendToServerService', () => {
  let service: SendToServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendToServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
