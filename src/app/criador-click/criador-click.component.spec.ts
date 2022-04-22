import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriadorClickComponent } from './criador-click.component';

describe('CriadorClickComponent', () => {
  let component: CriadorClickComponent;
  let fixture: ComponentFixture<CriadorClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriadorClickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriadorClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
