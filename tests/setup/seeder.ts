
import * as faker from 'faker';
import { MysqlInvoker } from '../../index';

const mysql = new MysqlInvoker('localhost', '__juniorMAD27', { multipleStatements: true });

mysql.invoke<any[]>('createUser', ...Array.from(new Array(10), () => ({ name: faker.name.findName() }))).then(results => {

    console.log(results.filter(result => Array.isArray(result)).map(result => result[0]));

}).catch(console.error);

