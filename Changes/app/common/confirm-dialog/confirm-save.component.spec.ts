import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSaveComponent } from './confirm-save.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ConfirmSaveComponent', () => {
  let component: ConfirmSaveComponent;
  let fixture: ComponentFixture<ConfirmSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSaveComponent ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
