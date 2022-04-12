import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordChartGenComponent } from './chord-chart-gen.component';

describe('ChordChartGenComponent', () => {
  let component: ChordChartGenComponent;
  let fixture: ComponentFixture<ChordChartGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChordChartGenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordChartGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
