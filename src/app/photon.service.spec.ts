import { TestBed, inject } from '@angular/core/testing';

import { PhotonService } from './photon.service';

describe('PhotonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotonService]
    });
  });

  it('should be created', inject([PhotonService], (service: PhotonService) => {
    expect(service).toBeTruthy();
  }));
});
