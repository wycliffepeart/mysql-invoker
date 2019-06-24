import test from 'ava';
import { MysqlInvoker } from '../index';


test("Test Read Store Procedure", async t => {

  const mysql = new MysqlInvoker('localhost', 'secret', 'application', 'invoker');

  const result: object = (await mysql.invoke<any[]>('readUser', {id: 1}))[0][0];

  t.assert(result.hasOwnProperty('id'), 'Property exists on object')

});


test("Test List Store Procedure", async t => {

  const mysql = new MysqlInvoker('localhost', 'secret', 'application', 'invoker');

  const result: object = (await mysql.invoke<any[]>('listUser', {limit: 30, offset: 0}))[0];

  t.assert(Array.isArray(result), 'Property exists on object')

});