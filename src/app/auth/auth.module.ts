import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SignupPage } from './signup/signup.page';
import { SigninPage } from './signin/signin.page';

const routes = [
  {
    path: 'signin',
    component: SigninPage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
];

@NgModule({
  declarations: [SigninPage, SignupPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  exports: [SigninPage, SignupPage],
})
export class AuthModule {}
