
import * as faker from 'faker';
import { MysqlInvoker } from '../../index';
import { connectionCongif } from './connection';

const mysql = new MysqlInvoker(connectionCongif());

const seeds = Array.from(new Array(10), () => ({ name: faker.name.findName() }));

mysql.invoke<any[]>('createUser', ...seeds).then(results => {

    console.log(results.filter(result => Array.isArray(result)).map(result => result[0]));

}).catch(console.error);

