import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetSignedLanguageInput } from '../../../../modules/translate/translate.actions';

@Component({
  selector: 'app-signed-language-input',
  templateUrl: './signed-language-input.component.html',
  styleUrls: ['./signed-language-input.component.scss']
})
export class SignedLanguageInputComponent {
  signText: string = '';

  constructor(private store: Store) {}

  onInputChange(event: any) {
    this.signText = event.target.value;
    console.log("Input changed:", this.signText); // Debugging: log input changes
  }

  translateSignText() {
    console.log("Dispatching input text for translation:", this.signText); // Debugging: log before dispatch
    this.store.dispatch(new SetSignedLanguageInput(this.signText));
  }
}
