import { Component } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormMode } from '../../shared/constant';
import { SwalModalService } from '../../shared/components/services';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'
})
export class CrudComponent {
  mode: FormMode;
  form: FormGroup;
   busyLoading: boolean = false;
  currentLanguage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private employeeService:EmployeeService,
    private swalModalService: SwalModalService
    
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      position: ['', [Validators.required, Validators.minLength(3)]],
      department: ['',[Validators.required, Validators.minLength(3)]],
      salary: [null, [Validators.required,Validators.min(0)]],
     
      // phoneNumber: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.minLength(12),
      //     Validators.maxLength(12),
      //   ],
      // ], 
    });

    this.mode = this.route.snapshot.data['mode'];
     if (this.mode === FormMode.View) {
       this.form.disable();
    }
  }

  ngOnInit(): void {
    if (this.mode === FormMode.Edit || this.mode === FormMode.View) {
      this.getEmployeeById(this.route.snapshot.params['id']);
    }
  }

  getEmployeeById(id: string) {
    this.busyLoading = true;
     this.employeeService.getByID(id).subscribe({
      next: (data) => {
        console.log("🚀 ~ CrudComponent ~ this.employeeService.getByID ~ data:", data)
        this.form.patchValue(data);
      },
      complete: () => {
        this.busyLoading = false;
      },
     }
    );
  }
 
  submit() {
    console.log(this.form);
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    if (this.mode === FormMode.Create) {
      this.create();
    } else {
      this.edit();
    }
  }
  create() {
    let body = this.form.value;
     
    this.employeeService.create(body).subscribe({
      next: (data) => {
        this.form.reset();
        this.swalModalService.Notifier('Created Successfully')
      },
     complete: () => {
      this.busyLoading = false
     }
    });
  }
  edit() {
    let body = this.form.value;
    body.identificationNumber = String(body.identificationNumber);
      this.employeeService.update(this.route.snapshot.params['id'],body).subscribe({
        next: (data) => {
          this.swalModalService.Notifier('Updated Successfully')
        },
       complete: () => {
        this.busyLoading = false
       }
      });
  }
}
