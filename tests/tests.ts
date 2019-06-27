import test from 'ava';
import { userRepository } from './setup/user.model';


test("Test Read Store Procedure", async t => {

  const result: object = (await userRepository.readUser<any>(1));

  console.log(result);

  t.pass();
  // t.assert(result.hasOwnProperty('id'), 'Property exists on object')

});


test("Test List Store Procedure", async t => {

  const result: object = (await userRepository.listUser<any[]>(255, 0))[0];

  console.log(result);

  t.assert(Array.isArray(result), 'Property exists on object')

});