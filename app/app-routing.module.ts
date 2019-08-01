import { AppAuthGuard } from './app.authguard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookmarksComponent } from './bookmark/bookmark.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';


const routes: Routes = [
  {
    path: '',
    component: BookmarksComponent,
    canActivate: [AppAuthGuard]
  },
  { path: 'forbidden', component: ForbiddenComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
