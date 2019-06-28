import test from 'ava';
import { userRepository } from './setup/user.model';

test("Test List Users Store Procedure", async t => {

  const result: object = (await userRepository.listUser<any[]>(255, 0))[0];

  t.assert(Array.isArray(result), 'Property exists on object')

});


test("Test Read User Store Procedure", async t => {

  const result: any = (await userRepository.readUser<any>(1))[0][0];

  t.assert(result.id === 1, 'Property exists on object')

});


test("Test Update User Store Procedure", async t => {

  const result: any = (await userRepository.updateUser<any[]>({id: 1, name: "Wycliffe Peart"}))[0][0];

  t.assert(result.id === 1, 'Property exists on object')

});