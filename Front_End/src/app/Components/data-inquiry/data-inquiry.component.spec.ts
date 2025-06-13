import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInquiryComponent } from './data-inquiry.component';

describe('DataInquiryComponent', () => {
  let component: DataInquiryComponent;
  let fixture: ComponentFixture<DataInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataInquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
