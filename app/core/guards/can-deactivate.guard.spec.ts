import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { ComponentCanDeactivate } from './component-can-deactivate';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;
  let mockComponent: ComponentCanDeactivate;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard]
    });
    
    guard = TestBed.inject(CanDeactivateGuard);
    mockRoute = new ActivatedRouteSnapshot();
    mockState = { url: '/test' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true when component has no canDeactivate method', () => {
      mockComponent = {} as ComponentCanDeactivate;
      
      const result = guard.canDeactivate(mockComponent, mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should return component canDeactivate result when method exists and returns boolean', () => {
      mockComponent = {
        canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(false)
      };
      
      const result = guard.canDeactivate(mockComponent, mockRoute, mockState);
      
      expect(result).toBe(false);
      expect(mockComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should return component canDeactivate result when method exists and returns true', () => {
      mockComponent = {
        canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(true)
      };
      
      const result = guard.canDeactivate(mockComponent, mockRoute, mockState);
      
      expect(result).toBe(true);
      expect(mockComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should handle component canDeactivate returning Promise', () => {
      const promise = Promise.resolve(false);
      mockComponent = {
        canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(promise)
      };
      
      const result = guard.canDeactivate(mockComponent, mockRoute, mockState);
      
      expect(result).toBe(promise);
      expect(mockComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should handle null canDeactivate method', () => {
      mockComponent = {
        canDeactivate: null
      } as any;
      
      const result = guard.canDeactivate(mockComponent, mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should handle undefined canDeactivate method', () => {
      mockComponent = {
        canDeactivate: undefined
      } as any;
      
      const result = guard.canDeactivate(mockComponent, mockRoute, mockState);
      
      expect(result).toBe(true);
    });
  });
});
