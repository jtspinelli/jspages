import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaAcordeComponent } from './busca-acorde.component';

describe('BuscaAcordeComponent', () => {
  let component: BuscaAcordeComponent;
  let fixture: ComponentFixture<BuscaAcordeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscaAcordeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscaAcordeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
