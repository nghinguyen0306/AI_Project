import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { VideoStateModel } from '../../../core/modules/ngxs/store/video/video.state';
import { InputMode } from '../../../modules/translate/translate.state';
import { CopySpokenLanguageText } from '../../../modules/translate/translate.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signed-to-spoken',
  templateUrl: './signed-to-spoken.component.html',
  styleUrls: ['./signed-to-spoken.component.scss'],
})
export class SignedToSpokenComponent implements OnInit {
  videoState$!: Observable<VideoStateModel>;
  inputMode$!: Observable<InputMode>;
  spokenLanguage$!: Observable<string>;
  spokenLanguageText$!: Observable<string>;

  constructor(private store: Store) {
    this.videoState$ = this.store.select<VideoStateModel>(state => state.video);
    this.inputMode$ = this.store.select<InputMode>(state => state.translate.inputMode);
    this.spokenLanguage$ = this.store.select<string>(state => state.translate.spokenLanguage);
    this.spokenLanguageText$ = this.store.select<string>(state => state.translate.spokenLanguageText);
  }

  ngOnInit(): void {
    // Add any necessary initialization here, if needed
  }

  copyTranslation() {
    this.store.dispatch(CopySpokenLanguageText);
  }
}
