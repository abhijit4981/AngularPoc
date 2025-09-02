import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render error message', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Some internal error occured. Please contact your administrator.');
  });

  it('should have error-section class', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.error-section')).toBeTruthy();
  });

  it('should initialize component properly', () => {
    expect(component.ngOnInit).toBeDefined();
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
