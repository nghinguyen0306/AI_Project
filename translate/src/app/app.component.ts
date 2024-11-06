import { AfterViewInit, Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { filter, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetSpokenLanguageText } from './modules/translate/translate.actions';
import { firstValueFrom } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleAnalyticsService } from './core/modules/google-analytics/google-analytics.service';
import { Capacitor } from '@capacitor/core';
import { languageCodeNormalizer } from './core/modules/transloco/languages';
import { Meta } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  urlParams = this.getUrlParams();
  user$ = this.usersService.currentUserProfile$; // Observing the user state

  constructor(
    private meta: Meta,
    private ga: GoogleAnalyticsService,
    private transloco: TranslocoService,
    private router: Router,
    private store: Store,
    private authService: AuthService, // Inject AuthService
    public usersService: UsersService  // Inject UsersService for user$ observable
  ) {
    this.listenLanguageChange();
    this.logRouterNavigation();
    this.checkURLEmbedding();
    this.checkURLText();
    this.setPageKeyboardClass();
  }

  async ngAfterViewInit() {
    if (Capacitor.isNativePlatform()) {
      this.meta.updateTag({
        name: 'viewport',
        content:
          'minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, initial-scale=1.0, viewport-fit=cover, width=device-width',
      });

      const { SplashScreen } = await import(
        /* webpackChunkName: "@capacitor/splash-screen" */ '@capacitor/splash-screen'
      );
      await SplashScreen.hide();
    }
  }

  logRouterNavigation() {
    const isLanguageLoaded = firstValueFrom(
      this.transloco.events$.pipe(filter(e => e.type === 'translationLoadSuccess'))
    );

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(async (event: NavigationEnd) => {
          await isLanguageLoaded;
          await this.ga.setCurrentScreen(event.urlAfterRedirects);
        })
      )
      .subscribe();
  }

  getUrlParams() {
    if (!('window' in globalThis)) {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  }

  listenLanguageChange() {
    const urlParam = this.urlParams.get('lang');
    if (!('navigator' in globalThis) || !('document' in globalThis)) {
      if (urlParam) {
        this.transloco.setActiveLang(urlParam);
      }
      return;
    }

    this.transloco.langChanges$
      .pipe(
        tap(lang => {
          document.documentElement.lang = lang;
          document.dir = ['he', 'ar', 'fa', 'ku', 'ps', 'sd', 'ug', 'ur', 'yi'].includes(lang) ? 'rtl' : 'ltr';

          const openSearch = Array.from(document.head.children).find(t => t.getAttribute('rel') === 'search');
          if (openSearch) {
            openSearch.setAttribute('href', `/opensearch.xml?lang=${lang}`);
          }
        })
      )
      .subscribe();

    this.transloco.setActiveLang(urlParam || languageCodeNormalizer(navigator.language));
  }

  checkURLEmbedding(): void {
    const urlParam = this.urlParams.get('embed');
    if (urlParam !== null) {
      document.body.classList.add('embed');
    }
  }

  checkURLText(): void {
    const urlParam = this.urlParams.get('text');
    if (urlParam !== null) {
      this.store.dispatch(new SetSpokenLanguageText(urlParam));
    }
  }

  async setPageKeyboardClass() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    const { Keyboard } = await import(/* webpackChunkName: "@capacitor/keyboard" */ '@capacitor/keyboard');
    const html = document.documentElement;
    const className = 'keyboard-is-open';
    Keyboard.addListener('keyboardWillShow', () => html.classList.add(className));
    Keyboard.addListener('keyboardWillHide', () => html.classList.remove(className));
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']); // Redirect to home or login on logout
    });
  }
}
