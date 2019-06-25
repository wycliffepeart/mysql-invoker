
import * as faker from 'faker';
import { MysqlInvoker, Invoker } from '../../index';
import { connectionCongif } from './connection';

const mysql = new MysqlInvoker(connectionCongif({multipleStatements: true }));

const seeds = Array.from(new Array(10), () => ({ name: faker.name.findName() }));

/**
 * Invoke create user and pass an array of object to it
 */
mysql.invoke<any[]>('createUser', ...seeds).then(results => {

    console.log(results.filter(result => Array.isArray(result)).map(result => result[0]));

}).catch(console.error);



/**
 * Setup invoker global config
 */
MysqlInvoker.config(connectionCongif());

const seeds2 = Array.from(new Array(10), () => ({ name: faker.name.findName() }));

/**
 * Invoke create user and pass an array of object to it
 */
Invoker.invoke<any[]>('createUser', ...seeds2).then(results => {

    console.log(results.filter(result => Array.isArray(result)).map(result => result[0]));

}).catch(console.error);
