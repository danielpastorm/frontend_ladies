import { TestBed } from '@angular/core/testing';

import { PerfilServiceService } from './perfil-service.service';

describe('PerfilServiceService', () => {
  let service: PerfilServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
