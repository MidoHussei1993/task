import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CrudComponent } from './crud/crud.component';
import { FormMode } from '../shared/constant';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ListComponent },
      {
        path: 'create',
        component: CrudComponent,
        data: { mode: FormMode.Create },
      },
      {
        path: 'edit/:id',
        component: CrudComponent,
        data: { mode: FormMode.Edit },
      },
      {
        path: 'view/:id',
        component: CrudComponent,
        data: { mode: FormMode.View },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
