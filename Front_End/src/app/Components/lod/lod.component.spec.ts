import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodComponent } from './lod.component';

describe('LodComponent', () => {
  let component: LodComponent;
  let fixture: ComponentFixture<LodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
