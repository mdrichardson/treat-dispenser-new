import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTimesComponent } from './schedule-times.component';

describe('ScheduleTimesComponent', () => {
  let component: ScheduleTimesComponent;
  let fixture: ComponentFixture<ScheduleTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
