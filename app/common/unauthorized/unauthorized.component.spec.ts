import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedComponent } from './unauthorized.component';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthorizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render unauthorized message', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Account is not assigned . Please contact your administrator.');
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
