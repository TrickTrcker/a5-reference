import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { PendingInterceptorService, PendingInterceptorServiceFactoryProvider } from './pending-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SPINKIT_COMPONENTS } from './spinkits';

const PendingInterceptorServiceExistingProvider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: PendingInterceptorService,
  multi: true
};

@NgModule({
  declarations: [
      SpinnerComponent,
      SPINKIT_COMPONENTS,
  ],
  imports: [
      CommonModule,
      HttpClientModule,
  ],
  exports: [
      SpinnerComponent,
      SPINKIT_COMPONENTS,
  ],
  providers: [
      PendingInterceptorServiceExistingProvider,
      PendingInterceptorServiceFactoryProvider,
  ]
})
export class HttpLoaderModule { }
