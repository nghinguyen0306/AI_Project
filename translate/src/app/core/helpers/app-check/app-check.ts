import { environment } from '../../../../environments/environment';

export class AppCheck {
  static isInitialized = false;

  static async getToken(): Promise<string> {
    // Skip App Check initialization if not needed
    return '';
  }
}
