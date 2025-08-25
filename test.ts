// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Import all spec files manually since require.context has issues
import './app/app.component.spec';
import './app/core/services/publisher.service.spec';
import './app/core/services/auth.service.spec';
import './app/core/services/message.service.spec';
import './app/core/services/http/http.service.spec';
import './app/core/services/init/app-config.service.spec';
import './app/core/utils/app-util.service.spec';
import './app/modules/dashboard/dashboard.component.spec';
import './app/modules/login/login.component.spec';
import './app/common/header/header.component.spec';
import './app/common/footer/footer.component.spec';
import './app/common/navbar/navbar.component.spec';
import './app/common/unauthorized/unauthorized.component.spec';
import './app/common/error/error.component.spec';
import './app/modules/page-not-found/page-not-found.component.spec';
import './app/shared/services/common.service.spec';
import './app/shared/services/dialog.service.spec';
import './app/shared/pipes/mask-input.pipe.spec';
import './app/shared/pipes/parse-date.pipe.spec';