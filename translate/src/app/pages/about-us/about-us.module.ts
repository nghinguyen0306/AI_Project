import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AboutUsComponent } from './about-us.component';

const routes: Routes = [
  { path: '', component: AboutUsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule, // This should provide `ion-content`
    AboutUsComponent, // Import the standalone component directly if it's standalone
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AboutUsModule {}
