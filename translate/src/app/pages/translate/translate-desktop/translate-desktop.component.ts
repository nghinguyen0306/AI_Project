import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../../../components/base/base.component';
import { SaveTranslation } from './../../../modules/translate/translate.state';

@Component({
  selector: 'app-translate-desktop',
  templateUrl: './translate-desktop.component.html',
  styleUrls: ['./translate-desktop.component.scss'],
})
export class TranslateDesktopComponent extends BaseComponent implements OnInit {
  spokenToSigned$: Observable<boolean>;
  spokenToSigned: boolean;
  translationText: string = '';  // Store the translated text here
  translationVideoURL: string = '';  // Store the video URL here

  constructor(private store: Store) {
    super();
    this.spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);
  }

  ngOnInit(): void {
    this.spokenToSigned$
      .pipe(
        tap(spokenToSigned => (this.spokenToSigned = spokenToSigned)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  // Function to save the translation
  saveTranslation() {
    this.store.dispatch(new SaveTranslation(this.translationText, this.translationVideoURL));
  }

  // Function to handle translation completion
  onTranslationComplete(text: string, videoURL: string) {
    this.translationText = text;
    this.translationVideoURL = videoURL;
    this.saveTranslation();
  }
}
