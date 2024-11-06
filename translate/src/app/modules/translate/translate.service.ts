import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, addDoc, Timestamp, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private lastSpokenLanguageSegmenter: { language: string; segmenter: Intl.Segmenter };

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // Function to save translation with error handling
  async saveTranslation(text: string, videoURL: string) {
    const user = await this.authService.currentUser$.toPromise();
    if (!user) {
      throw new Error("User must be logged in to save translations.");
    }

    const translationsRef = collection(this.firestore, 'translations');
    return addDoc(translationsRef, {
      textArea: text,
      videoURL: videoURL,
      userID: user.uid,
      timestamp: Timestamp.now(),
    }).catch(error => {
      console.error("Error saving translation:", error);
      throw error;
    });
  }

  // Function to retrieve translations for a specific user with error handling
  async getUserTranslations(userID: string): Promise<any[]> {
    const translationsRef = collection(this.firestore, 'translations');
    const q = query(translationsRef, where("uid", "==", userID));
    const querySnapshot = await getDocs(q);
    
    const translations = [];
    querySnapshot.forEach((doc) => {
      translations.push(doc.data());
    });
    
    return translations;
  }
  

  signedLanguages = [
    'ase', 'gsg', 'fsl', 'bfi', 'ils', 'sgg', 'ssr', 'slf', 'ssp', 'jos', 'rsl-by', 'bqn',
    'csl', 'csq', 'cse', 'dsl', 'ins', 'nzs', 'eso', 'fse', 'asq', 'gss-cy', 'gss', 'icl',
    'ise', 'jsl', 'lsl', 'lls', 'psc', 'pso', 'bzs', 'psr', 'rms', 'rsl', 'svk', 'aed', 'csg',
    'csf', 'mfs', 'swl', 'tsm', 'ukl', 'pks',
  ];

  spokenLanguages = [
    'en', 'de', 'fr', 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca',
    'ceb', 'ny', 'zh', 'co', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'tl', 'fi', 'fy', 'gl', 'ka',
    'es', 'el', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it',
    'ja', 'jv', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk',
    'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'or', 'ps', 'fa', 'pl', 'pt',
    'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'su', 'sw',
    'sv', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh',
    'yi', 'yo', 'zu',
  ];

  splitSpokenSentences(language: string, text: string): string[] {
    if (!('Segmenter' in Intl)) {
      return [text];
    }

    if (this.lastSpokenLanguageSegmenter?.language !== language) {
      this.lastSpokenLanguageSegmenter = {
        language,
        segmenter: new Intl.Segmenter(language, { granularity: 'sentence' }),
      };
    }

    const segments = this.lastSpokenLanguageSegmenter.segmenter.segment(text);
    return Array.from(segments).map(segment => segment.segment);
  }

  normalizeSpokenLanguageText(language: string, text: string): Observable<string> {
    const params = new URLSearchParams();
    params.set('lang', language);
    params.set('text', text);
    const url = 'https://sign.mt/api/text-normalization?' + params.toString();

    return this.http.get<{ text: string }>(url).pipe(
      map(response => response.text),
      catchError(error => {
        console.error("Error normalizing text:", error);
        return throwError(error);
      })
    );
  }

  describeSignWriting(fsw: string): Observable<string> {
    const url = 'https://sign.mt/api/signwriting-description';

    return this.http
      .post<{ result: { description: string } }>(url, { data: { fsw } })
      .pipe(
        map(response => response.result.description),
        catchError(error => {
          console.error("Error describing sign writing:", error);
          return throwError(error);
        })
      );
  }

  translateSpokenToSigned(text: string, spokenLanguage: string, signedLanguage: string): string {
    const api = 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose';
    return `${api}?text=${encodeURIComponent(text)}&spoken=${spokenLanguage}&signed=${signedLanguage}`;
  }
}
