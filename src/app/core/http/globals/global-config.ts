export const BaseURL = 'https://task-dot-fe-task-428108.uc.r.appspot.com/';

enum OperationEnum {
  SEARCH = '/Search',
  GET_DDL = '/GetDDL',
  GET_BY_ID = '/GetById/',
  ADD = '/Add',
  UPDATE = '/Update',
  DELETE = '/Delete/',
  DEACTIVE = '/ChangeCoboneActivation',
  DeactivateCategory = '/changeActivation',
}

export class END_POINTS {

  public static readonly Employees = {
    list: BaseURL + '/employees',
    create: BaseURL + '/employees',
    getById: (id: string) => BaseURL + `employees/${id}`,
    update: (id: string) => BaseURL + `employees/${id}`,
    delete: (id: string) => BaseURL + `employees/${id}`,
  };
}
