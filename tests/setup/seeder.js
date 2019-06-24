"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker = __importStar(require("faker"));
const index_1 = require("../../index");
const connection_1 = require("./connection");
const mysql = new index_1.MysqlInvoker(connection_1.connectionCongif());
const seeds = Array.from(new Array(10), () => ({ name: faker.name.findName() }));
mysql.invoke('createUser', ...seeds).then(results => {
    console.log(results.filter(result => Array.isArray(result)).map(result => result[0]));
}).catch(console.error);
