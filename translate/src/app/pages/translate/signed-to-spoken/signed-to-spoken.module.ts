import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TextToSpeechModule } from '../../../components/text-to-speech/text-to-speech.module';
import { SignWritingModule } from '../signwriting/signwriting.module';
import { VideoModule } from '../../../components/video/video.module';
import { AppTranslocoModule } from '../../../core/modules/transloco/transloco.module';

import { SignedToSpokenComponent } from './signed-to-spoken.component';
import { UploadComponent } from './upload/upload.component';
import { SignedLanguageInputComponent } from './signed-language-input/signed-language-input.component';
import { SpokenLanguageOutputComponent } from './spoken-language-output/spoken-language-output.component'; // Import SpokenLanguageOutputComponent
import { SpokenToSignedModule } from '../spoken-to-signed/spoken-to-signed.module';

const componentModules = [VideoModule, SignWritingModule, TextToSpeechModule];

const components = [
  SignedToSpokenComponent,
  SignedLanguageInputComponent,
  UploadComponent,
  SpokenLanguageOutputComponent // Add SpokenLanguageOutputComponent here
];

@NgModule({
  imports: [
    CommonModule,
    AppTranslocoModule,
    IonicModule,
    MatTooltipModule,
    ...componentModules,
    SpokenToSignedModule
  ],
  declarations: components, // Declare all components, including SpokenLanguageOutputComponent
  exports: components, // Export components if they are needed outside this module
})
export class SignedToSpokenModule {}
