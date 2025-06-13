import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelProfileComponent } from './intel-profile.component';

describe('IntelProfileComponent', () => {
  let component: IntelProfileComponent;
  let fixture: ComponentFixture<IntelProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntelProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntelProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
