import * as Mysql from 'mysql';
import {ActionParams} from './contracts';
import {MysqlInvoker} from './mysql.invoker';

/**
 * Run the given action against the mysql database store procedure
 *
 * @param {string} connectionConfig
 * @return {Promise<T>}
 */
export function CreateFunctionRepository<T>(connectionConfig: Mysql.PoolConfig | Mysql.ConnectionConfig = {}): T {
  
  return new Proxy<any>(connectionConfig, {
    
    get: function (connectionConfig: Mysql.PoolConfig | Mysql.ConnectionConfig, prop: string): (...models: ActionParams) => Promise<T> {
      
      return function (...models: ActionParams): Promise<T> {
        
        console.log({connectionConfig, prop, models});
        
        const mysql = new MysqlInvoker(connectionConfig);
        
        return mysql.invokeFunction(prop, ...models);
        
      };
      
    }
    
  })
  
}