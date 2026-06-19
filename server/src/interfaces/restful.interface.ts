export interface RestfulServiceType {
  postOne(data: any, condition: any): any;
  postAll(data: any[], condition: any): any;

  put(data: any, condition: any): any;

  getOne(condition: any): any;
  getAll(condition: any): any;

  delete(condition: any): any;
}
