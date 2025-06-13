import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredebComponent } from './credeb.component';

describe('CredebComponent', () => {
  let component: CredebComponent;
  let fixture: ComponentFixture<CredebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredebComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
