
import * as faker from 'faker';
import { userRepository } from './user.model';


const seeds = Array.from(new Array(10), () => ({ name: faker.name.findName() }));

userRepository.createUser<any>(...seeds).then(results => {

  console.log(results.filter((result: any) => Array.isArray(result)).map((result: any[]) => result[0]));

}).catch(console.error);

