import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { InquiryService } from './inquiry.service';
import { SalesOrderService } from './salesOrder.service';
import { LodService } from './lod.service';
import { OsdService } from './osd.service';
import { CredebService } from './credeb.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('ProfileService', () => {
  let Pservice: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    Pservice = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(Pservice).toBeTruthy();
  });
});

describe('InquiryService', () => {
  let Iservice: InquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    Iservice = TestBed.inject(InquiryService);
  });

  it('should be created', () => {
    expect(Iservice).toBeTruthy();
  });
});

describe(' SalesOrderService ', () => {
  let SOservice:  SalesOrderService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    SOservice = TestBed.inject( SalesOrderService);
  });

  it('should be created', () => {
    expect(SOservice).toBeTruthy();
  });
});

describe(' LodService ', () => {
  let LODservice:   LodService  ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
     LODservice = TestBed.inject(  LodService );
  });

  it('should be created', () => {
    expect( LODservice).toBeTruthy();
  });
});

describe(' OsdService ', () => {
  let OSDservice:   OsdService  ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
     OSDservice = TestBed.inject( OsdService );
  });

  it('should be created', () => {
    expect( OSDservice).toBeTruthy();
  });
});


describe(' CredebService', () => {
  let Cdservice: CredebService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
     Cdservice = TestBed.inject(  CredebService);
  });

  it('should be created', () => {
    expect( Cdservice).toBeTruthy();
  });
});

