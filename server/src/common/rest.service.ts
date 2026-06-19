import { Model, BuildOptions, FindOptions } from 'sequelize';
import { RestfulServiceType } from 'src/interfaces/restful.interface';

type AnyModel = typeof Model & {
  new (values?: object, options?: BuildOptions): any;
};

// interface M extends Model{}

class RestService implements RestfulServiceType {
  model: AnyModel;

  constructor(model: AnyModel) {
    this.model = model;
  }

  /* ============================================================================================================================ */
  /*
  find many records
  */
  getAll(condition: FindOptions<any>) {
    return this.model.findAll(condition);
  }

  /*
  find 1 record
  */
  getOne(condition: any) {
    return this.model.findOne({ ...condition });
  }

  /* ============================================================================================================================ */
  /*
  create 1 record
  */
  postOne(data: any, condition: any) {
    return this.model.create({ ...data }, { ...condition });
  }

  /*
  create many records
  */
  postAll(data: any[], condition: any) {
    return this.model.bulkCreate([...data], { ...condition });
  }

  /* ============================================================================================================================ */
  /*
  update 1 or many records
  */
  put(data: any, condition: any) {
    return this.model.update({ ...data }, { ...condition });
  }

  /* ============================================================================================================================ */
  /*
  delete 1 record
  */
  delete(condition: any) {
    return this.model.destroy({ ...condition });
  }

  /* ============================================================================================================================ */
  /*
  count record number
  */
  count(condition: any): Promise<any> {
    return this.model.count({ ...condition });
  }
  findAndCount(condition: any) {
    return this.model.findAndCountAll({ ...condition });
  }

  /* ============================================================================================================================ */
  /*
  find or create
  */
  findOrCreate(condition: any) {
    return this.model.findOrCreate({ ...condition });
  }

  /* ============================================================================================================================ */
  /*
  create or update
  */
  createOrUpdate(condition: any) {
    return this.model.upsert({ ...condition });
  }
}

export default RestService;
