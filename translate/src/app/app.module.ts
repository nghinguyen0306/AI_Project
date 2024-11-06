import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavigatorService} from './core/services/navigator/navigator.service';
import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppTranslocoModule} from './core/modules/transloco/transloco.module';
import {AppNgxsModule} from './core/modules/ngxs/ngxs.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {isSafari} from './core/constants';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from './core/services/http/token-interceptor.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { LayoutComponent } from './layout/layout.component'; 
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppNgxsModule,
    IonicModule.forRoot({mode: isSafari ? 'ios' : 'md'}),
    AppRoutingModule,
    AppTranslocoModule,
    LayoutComponent,
    

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    NavigatorService,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    provideFirebaseApp(() => initializeApp({"projectId":"sign-translation-a34c3","appId":"1:607520156835:web:51687e89ca5bfa3835a316","storageBucket":"sign-translation-a34c3.appspot.com","apiKey":"AIzaSyAdCnRalYMh1oZw0MbMstfQSqSbmzjC4FU","authDomain":"sign-translation-a34c3.firebaseapp.com","messagingSenderId":"607520156835","measurementId":"G-NLJL29DLGH"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
