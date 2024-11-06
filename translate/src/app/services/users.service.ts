import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  // Stream of the current user profile
  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null); // No user logged in
        }

        const ref = doc(this.firestore, 'users', user.uid);
        return docData(ref).pipe(
          switchMap(profile => {
            if (profile) {
              return of(profile as ProfileUser); // Return existing profile
            } else {
              // Create a new user profile document if it doesn't exist
              const newUser: ProfileUser = {
                uid: user.uid,
                displayName: user.displayName || 'User',
                email: user.email || '',
              };
              return this.addUser(newUser).pipe(
                switchMap(() => of(newUser))
              );
            }
          })
        );
      })
    );
  }

  // Adds a new user profile to Firestore
  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid); // Ensure doc() is used here
    return from(setDoc(ref, user));
  }

  // Updates an existing user profile in Firestore
  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
