import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NavbarTitleConstants } from './navbar.contants';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let modalSpy: jasmine.SpyObj<NgbModal>;
  let publisherSpy: any;
  let commonServiceSpy: jasmine.SpyObj<CommonService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let isAuthChanged$: Subject<boolean>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    modalSpy = jasmine.createSpyObj('NgbModal', ['open']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['stgEdrParticipantDateProcess']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['success']);

    isAuthChanged$ = new Subject<boolean>();
    publisherSpy = { isAuthChanged$: isAuthChanged$.asObservable() };

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NgbModal, useValue: modalSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: PublisherService, useValue: publisherSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    authSpy.isAuthenticated.and.returnValue(true);
    commonServiceSpy.stgEdrParticipantDateProcess.and.returnValue(of({}));
  });

  it('should initialize and subscribe to auth changes', () => {
    component.ngOnInit();
    expect(component.authenticated).toBeTrue();

    isAuthChanged$.next(false);
    expect(component['authenticated']).toBeFalse();
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    spyOn(component['authenticationSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['authenticationSubscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should navigate if menu item has no submenu', () => {
    const menuItem = component.menuOptions[0]; // Dashboard
    component.showChilds(0);
    expect(menuItem.highlight).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`/${menuItem.src}`]);
  });

  it('should toggle submenu items and collapse others', () => {
    const recordMenu = component.menuOptions[1]; // RecordMaintenance with subItems
    component.showChilds(1);
    expect(recordMenu.isClicked).toBeTrue();

    component.showChilds(1); // toggle again
    expect(recordMenu.isClicked).toBeFalse();
  });

  it('should open modal when subItem.redirectToPage = false', fakeAsync(() => {
    const subItem = component.menuOptions[1].subItems.find(s => !s.redirectToPage);

    const modalRefMock = {
      componentInstance: {},
      result: Promise.resolve('ok')
    };
    modalSpy.open.and.returnValue(modalRefMock as any);

    component.doMenuClick(subItem);

    tick(); // resolve modalRef.result

    expect(modalSpy.open).toHaveBeenCalled();
    expect(commonServiceSpy.stgEdrParticipantDateProcess).toHaveBeenCalled();
    expect(messageServiceSpy.success).toHaveBeenCalledWith(NavbarTitleConstants.Reprocess_Records_SUSS_MSG);
  }));

  it('should navigate when subItem.redirectToPage = true', () => {
    const subItem = component.menuOptions[1].subItems.find(s => s.redirectToPage);
    component.doMenuClick(subItem);
    expect(routerSpy.navigate).toHaveBeenCalledWith([`/${subItem.src}`]);
  });
});
