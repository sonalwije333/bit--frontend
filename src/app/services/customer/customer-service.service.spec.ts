import { TestBed } from '@angular/core/testing';

import { CustomerServiceService } from './customer-service.service';


describe('FormDemoServiceService', () => {
  let service: CustomerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
