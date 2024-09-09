import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components';

const components = [
  TableComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...components
  ]
})
export class SharedModule { }
