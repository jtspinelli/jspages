import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriadorComponent } from './criador.component';

describe('CriadorComponent', () => {
  let component: CriadorComponent;
  let fixture: ComponentFixture<CriadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
