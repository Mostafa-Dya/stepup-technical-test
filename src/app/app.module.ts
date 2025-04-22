import {
  importProvidersFrom,
  NgModule,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TaskModule } from './components/task-components/task.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideAnimations,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore, provideStates } from '@ngxs/store';
import { withNgxsWebSocketPlugin } from '@ngxs/websocket-plugin';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { TaskState } from './core/state/task.state';
import { apiInterceptor } from './interceptor/api.interceptor';
import Aura from '@primeng/themes/aura';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterModule.forRoot([]), TaskModule],
  bootstrap: [AppComponent],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideAnimations(),
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideStore(
      [],
      withNgxsReduxDevtoolsPlugin(),
      withNgxsFormPlugin(),
      withNgxsLoggerPlugin(),
      withNgxsRouterPlugin(),
      withNgxsStoragePlugin({
        keys: '*',
      }),
      withNgxsWebSocketPlugin()
    ),
    provideStates([TaskState]),
    importProvidersFrom(BrowserModule, BrowserAnimationsModule, TaskModule),
  ],
})
export class AppModule {}
