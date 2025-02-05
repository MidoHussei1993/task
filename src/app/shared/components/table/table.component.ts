import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { SwalModalService } from '../services';
export interface IActionLTable {
  title: string;
  label?: string;
  icon: string;
  type?: string;
  link?: string;
  prop?: string;
  hide?: boolean;
  command?: any;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  items = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
    },
  ];
  currentAction: any = {}; 
  @Input() list: any[] = [];
  @Input() properties: string[] = [];
  @Input() titles: string[] = [];
  @Input() filter: any = {};

  @Input() pagination: any = {};

  @Input() showDelete: boolean = true;
  @Input() hideActions: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showView: boolean = true;
  @Input() busyLoading: boolean = false;
  @Input() showActivation: boolean = false;
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @Input() addActions: boolean = false;
  _allowDay: IActionLTable[] = [];
  get actionList(): IActionLTable[] {
    return this._allowDay;
  }
  @Input() set actionList(value: IActionLTable[]) {
    // if (this.showDelete) {
    //   value.unshift({
    //     title: 'Delete',
    //     icon: 'fas fa-trash-alt text-danger',
    //     type: 'deleteRow',
    //   });
    // }
    // if (this.showView) {
    //   value.unshift({
    //     title: 'View',
    //     icon: 'far fa-eye text-primary',
    //     type: 'viewRow',
    //   });
    // }
    // if (this.showEdit) {
    //   value.unshift({
    //     title: 'Edit',
    //     icon: 'far fa-edit text-warning',
    //     type: 'EditRow',
    //   });
    // }
    this._allowDay = value.filter((action) => {
      action.label = action.title;
      action.icon = 'fas mx-2 ' + action.icon;
      action.command = () => {
        this.currentAction = action;
      }; 
      if (action.hasOwnProperty('hide')) {
        return action.hide;
      } else return true;
    });
  }
  // @Input() actionList: IActionLTable[] = [];
  @Output() aciton: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeActivation: EventEmitter<any> = new EventEmitter<any>();

  @Input() showAnotherCheck: boolean = false;
  @Input() AnotherCheckPropName: string = '';
  @Input() AnotherCheckTitelName: string = '';
  @Output() changeAnotherCheck: EventEmitter<any> = new EventEmitter<any>(); 

  @Input() rowsNumber: Number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  pageSize: number = 10;
  @Output() activetedPageSize = new EventEmitter<number>();
  @Output() activetedPageNumber = new EventEmitter<number>();

  @Output() search: EventEmitter<any> = new EventEmitter<any>();
  @Input() showSearch: boolean = false;
  @Input() showPagination: boolean = true;
  @Input() isdownloadAll: boolean = false;
  @Output() export = new EventEmitter<number>();

  @Input() isReload: boolean = false;
  @Output() reload = new EventEmitter<any>();

  @Input() disabledCheckBox: boolean = false;

  active: number = 1;
  form: FormGroup;
  sortedProperty = {
    propertyName: '',
    sortType: '',
    title: '',
  };
  constructor(
    private formBuilder: FormBuilder ,
    private swalService: SwalModalService, 
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {}

  searchValue(): void {
    this.search.emit(this.form.get('search')?.value);
  }
  Reload(): void {
    this.reload.emit('');
  }
  reset(): void {
    this.resetFilterObject();
    this.form.reset(); 
  }
  resetFilterObject() {
    const newQueryParam:any = {};
    const filterClone = new this.filter.constructor();
    Object.entries(filterClone as Object).map((keyProp:any) => {
      newQueryParam[keyProp[0]] = keyProp[1];
      this.filter[keyProp[0]] = keyProp[1];
    });
    const currentQueryParams = this.route.snapshot.queryParams;
    const updatedQueryParams = { ...currentQueryParams, ...newQueryParam };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedQueryParams,
      queryParamsHandling: 'merge',
    });
  }
  View(item: any): void {
    this.view.emit(item);
  }
  changeActivationCol(index: number): void {
    this.changeActivation.emit(index);
  }

  changeAnotherCheckCol(index: number): void {
    this.changeAnotherCheck.emit(index);
  }

  Edit(item: any): void {
    this.edit.emit(item);
  }

  Delete(item: any): void {
    this.swalService.deleteConfirmation().then((res) => {
      if (res) {
        this.delete.emit(item);
      }
    });
  }
  EmitAaction(event: any, item: any): void {
    console.log(this.currentAction);
    console.log(...arguments);
    switch (this.currentAction.type) {
      case 'EditRow':
        this.Edit(item);
        break;
      case 'deleteRow':
        this.Delete(item);
        break;
      case 'viewRow':
        this.View(item);
        break;

      default:
        break;
    }
    if (this.currentAction.link) {
      const URL = this.router.serializeUrl(
        this.router.createUrlTree([
          this.currentAction.link.replace('$', item[this.currentAction.prop]),
        ])
      );
      window.open(URL, '_blank');
      return;
    }
    this.aciton.emit({
      event: item,
      ...(this.currentAction.type && { type: this.currentAction.type }),
    });
  }

  pageSizeChanged(event: string) {
    // console.log(+event.split(': ')[1]);
    // console.log(this.pageSize);
    this.pageSize = Number(+event.split(': ')[1]);
    this.activetedPageSize.emit(+event.split(': ')[1]);
  }
  sendPageNumber(pageNumber: number) {
    this.active = pageNumber;
    this.activetedPageNumber.emit(pageNumber);
  }

 
  downloadAllData(): void {
    this.export.emit();
  }

  

  getObjectData(item: any) {
    const els = this.properties.map(
      (prop) => `<span class="pb-1 d-block ">${prop} : ${item[prop]}</span>`
    );
    return els.join('');
  }
  sortData(sortType: 'up' | 'down' = 'up', index: number, title:string) {
    try {
      const sortingProperty = this.properties[index];
      this.sortedProperty.propertyName = sortingProperty;
      this.sortedProperty.title = title;
      this.sortedProperty.sortType = sortType;
      if (sortType === 'up') {
        const clonedData = [
          ...this.list.sort((a, b) =>
            b[sortingProperty] > a[sortingProperty]
              ? 1
              : a[sortingProperty] > b[sortingProperty]
              ? -1
              : 0
          ),
        ];
        this.list = clonedData;
      } else if (sortType === 'down') {
        const clonedData = [
          ...this.list.sort((a, b) =>
            a[sortingProperty] > b[sortingProperty]
              ? 1
              : b[sortingProperty] > a[sortingProperty]
              ? -1
              : 0
          ),
        ];
        this.list = clonedData;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
