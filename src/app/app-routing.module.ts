import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';

const routes: Routes = [
  {
    path:'home',
    component:LayoutPageComponent
  },

  {
    path:'tasks',
    loadChildren: () => import('./tasks/tasks.module').then(module => module.TasksModule)
  },

  {
    path:'',
    redirectTo:'tasks',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
