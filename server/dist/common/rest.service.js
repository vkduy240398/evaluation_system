"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestService {
    constructor(model) {
        this.model = model;
    }
    getAll(condition) {
        return this.model.findAll(condition);
    }
    getOne(condition) {
        return this.model.findOne(Object.assign({}, condition));
    }
    postOne(data, condition) {
        return this.model.create(Object.assign({}, data), Object.assign({}, condition));
    }
    postAll(data, condition) {
        return this.model.bulkCreate([...data], Object.assign({}, condition));
    }
    put(data, condition) {
        return this.model.update(Object.assign({}, data), Object.assign({}, condition));
    }
    delete(condition) {
        return this.model.destroy(Object.assign({}, condition));
    }
    count(condition) {
        return this.model.count(Object.assign({}, condition));
    }
    findAndCount(condition) {
        return this.model.findAndCountAll(Object.assign({}, condition));
    }
    findOrCreate(condition) {
        return this.model.findOrCreate(Object.assign({}, condition));
    }
    createOrUpdate(condition) {
        return this.model.upsert(Object.assign({}, condition));
    }
}
exports.default = RestService;
//# sourceMappingURL=rest.service.js.map