import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologieComponent } from './ontologie.component';

describe('OntologieComponent', () => {
  let component: OntologieComponent;
  let fixture: ComponentFixture<OntologieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OntologieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
