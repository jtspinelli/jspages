import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriadorVisualComponent } from './criador-visual.component';

describe('CriadorVisualComponent', () => {
  let component: CriadorVisualComponent;
  let fixture: ComponentFixture<CriadorVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriadorVisualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriadorVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
