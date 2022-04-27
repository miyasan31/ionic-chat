import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// compat
// import {
//   AngularFireAuthGuard,
//   redirectUnauthorizedTo,
//   redirectLoggedInTo,
// } from '@angular/fire/compat/auth-guard';

// new
import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorized = () => redirectUnauthorizedTo(['auth/signin']);
const redirectLoggedIn = () => redirectLoggedInTo(['/']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    // canActivate: [AngularFireAuthGuard],
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorized },
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    // canActivate: [AngularFireAuthGuard],
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedIn },
  },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./shared/profile/profile.module').then( m => m.ProfilePageModule)
  // },
  // {
  //   path: 'signin',
  //   loadChildren: () => import('./auth/signin/signin.module').then((m) => m.SigninPageModule),
  // },
  // {
  //   path: 'signup',
  //   loadChildren: () => import('./auth/signup/signup.module').then((m) => m.SignupPageModule),
  // },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
