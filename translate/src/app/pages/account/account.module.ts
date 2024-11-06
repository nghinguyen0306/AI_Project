// src/app/pages/account/account.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AccountComponent } from './account.component';

const routes: Routes = [
  { path: '', component: AccountComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    AccountComponent // Import the standalone component here
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA to support Ionic components
})
export class AccountModule {}
