import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TranslateStateModel } from '../../../../modules/translate/translate.state';

@Component({
  selector: 'app-spoken-language-output',
  templateUrl: './spoken-language-output.component.html',
  styleUrls: ['./spoken-language-output.component.scss']
})
export class SpokenLanguageOutputComponent implements OnInit {
  translatedText$!: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.translatedText$ = this.store.select(state => state.translate.translatedSpokenText);
    this.translatedText$.subscribe(text => console.log("Translated Text:", text)); // Debugging log
  }
  
}
