import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }  from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DosimetryApiService} from '../../../core/api/dosimetry-api.service';
import { CommonService } from '../../../shared/services/common.service';
import { AppComponent } from '../../../app.component';

import { CrossReferencesComponent } from './cross-references.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/shared/services/dialog.service';

describe('CrossReferencesComponent', () => {
  let component: CrossReferencesComponent;
  let fixture: ComponentFixture<CrossReferencesComponent>;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterTestingModule, ToastrModule.forRoot() ],
      declarations: [ CrossReferencesComponent ],
      providers: [ DosimetryApiService, CommonService, AppComponent, ToastrService, DialogService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
