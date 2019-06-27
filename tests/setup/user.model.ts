
import { connectionCongif } from './connection';
import { CreateRepository } from '../../src/procedure.repository';

interface UserModel {

  name: string

}

interface UserRepository {

  /**
   * Create multiple or a single user in the database
   * 
   * @param users 
   * @return {Promise<T>}
   */
  createUser<T>(...users: UserModel[]): Promise<T>;

  /**
   * List a collection of user from the database
   * 
   * @param limit
   * @param offset
   * @return {Promise<T>}
   */
  listUser<T>(limit: number, offset: number): Promise<T>;

  /**
   * Read a single user from the database with the given id
   * 
   * @param id 
   * @return {Promise<T>}
   */
  readUser<T>(id: number): Promise<T>;

  /**
   * Read a single user from the database with the given id
   * 
   * @param id 
   * @return {Promise<T>}
   */
  readUser<T>(...id: object[]): Promise<T>;

}

export const userRepository = CreateRepository<UserRepository>(connectionCongif({ multipleStatements: true }));