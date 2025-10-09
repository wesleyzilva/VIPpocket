import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrLoyalty } from './qr-loyalty.component';

describe('QrLoyalty', () => {
  let component: QrLoyalty;
  let fixture: ComponentFixture<QrLoyalty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrLoyalty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrLoyalty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
