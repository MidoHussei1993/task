import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Employee } from '../types';
import { EmployeeService } from '../services/employee.service';
import { FormMode } from '../../shared/constant';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SwalModalService } from '../../shared/components/services';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [SharedModule, RouterLink, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  list: Employee[] = [];
  filter: Employee = new Employee();
  titles: string[] = ['name', 'position', 'department', 'salary'];
  properties: string[] = ['name', 'position', 'department', 'salary'];
  busyLoading: boolean = false;
  public get formMode(): typeof FormMode {
    return FormMode;
  }

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private swalModalService: SwalModalService
  ) {}
  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.busyLoading = true;
    this.employeeService.get().subscribe({
      complete: () => (this.busyLoading = false),
      next: (data: any) => {
        this.list = data;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  navigate(employee: Employee, type: FormMode) {
    switch (type) {
      case this.formMode.Edit:
        this.router.navigateByUrl(`employee/edit/${employee._id}`);
        break;
      case this.formMode.View:
        this.router.navigateByUrl(`employee/view/${employee._id}`);
        break;

      default:
        break;
    }
  }
  deleteItem(employee: Employee) {
    this.employeeService.delete(String(employee._id)).subscribe({
      next: () => {
        this.getList();
        this.swalModalService.Notifier('employeeDeleted');
      },
    });
  }
  search() {
   try {
    let filterdList: Employee[] = this.list;
    if (this.filter.name)
      filterdList = filterdList.filter((item) =>
        item.name.includes(this.filter.name)
      );
    if (this.filter.position)
      filterdList = filterdList.filter((item) =>
        item.position.includes(this.filter.position)
      );
    if (this.filter.department)
      filterdList = filterdList.filter((item) =>
        item.department.includes(this.filter.department)
      );
    if (this.filter.salary)
      filterdList = filterdList.filter(
        (item) => item.salary == this.filter.salary
      );
      this.list = filterdList;
   } catch (error) {
    console.log("🚀 ~ ListComponent ~ search ~ error:", error)
   }
  }
  reset() {
    this.filter = new Employee();
    this.getList();
  }
}
