import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmployeeRoutingModule, 
    ReactiveFormsModule,
    FormsModule,
     
  ],
  
})
export class EmployeeModule { }
