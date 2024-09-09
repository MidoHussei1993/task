export class Employee {
  constructor() {
    this.name = '';
    this.position = '';
    this.department = '';
  }
  _id?: string;
  name: string;
  position: string;
  department: string;
  salary?: number;
}
