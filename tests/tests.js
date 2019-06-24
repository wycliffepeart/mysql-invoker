"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const index_1 = require("../index");
ava_1.default("Test Read Store Procedure", async (t) => {
    const mysql = new index_1.MysqlInvoker('localhost', '__juniorMAD27');
    const result = (await mysql.invoke('readUser', { id: 1 }))[0][0];
    t.assert(result.hasOwnProperty('id'), 'Property exists on object');
});
ava_1.default("Test List Store Procedure", async (t) => {
    const mysql = new index_1.MysqlInvoker('localhost', '__juniorMAD27');
    const result = (await mysql.invoke('listUser', { limit: 30, offset: 0 }))[0];
    t.assert(Array.isArray(result), 'Property exists on object');
});
