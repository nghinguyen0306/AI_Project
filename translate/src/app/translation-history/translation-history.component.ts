import { Component, OnInit } from '@angular/core';
import { TranslationService } from './../modules/translate/translate.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-translation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './translation-history.component.html',
  styleUrls: ['./translation-history.component.scss']
})
export class TranslationHistoryComponent implements OnInit {
  translations = [];

  constructor(
    private translationService: TranslationService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user = await this.authService.currentUser$.toPromise();
    if (user) {
      this.translations = await this.translationService.getUserTranslations(user.uid);
    }
  }
}
