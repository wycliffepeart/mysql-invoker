import * as Mysql from 'mysql';

const key = Symbol.for('MYSQL_INVOKER_NAMESPACE_1580fa11-e9e2-4ea7-a3ca-435bb97c21e2');

export class MysqlInvoker {

  /**
   * Create an instance of this service
   *
   * @param connectionConfig
   */

  public constructor(private connectionConfig: Mysql.ConnectionConfig = {}) {}

  /**
   * 
   */
  private getConnectionConfig(){

    const config: Mysql.ConnectionConfig = (global as any)[key] || {};

    return Object.assign(config, this.connectionConfig);
  }

  /**
   * Set the global connection configuration
   * 
   * @param connectionConfig 
   */
  public static config(connectionConfig: Mysql.ConnectionConfig){

    const globalSymbols = Object.getOwnPropertySymbols(global);
  
    const hasNamespace = (globalSymbols.indexOf(key) > -1);
  
    if (!hasNamespace) (global as any)[key] = connectionConfig;

  }

  /**
   * Clean up any connection object in memory
   */
  public static flush(){

    delete (global as any)[key];
    
  }

  /**
   * Prepare the action for execution
   *
   * @param action
   * @param models
   * @return {object}
   */

  private prepareAction(action: string, models: object[]): string[] {

    return models.map((model) => {

      const sql = `CALL ${action}(${Object.keys(model).map(_key => '?').join(',')})`;

      return Mysql.format(sql, Object.values(model));

    });
  }

  /**
   * Run the given action against the mysql database store procedure
   *
   * @param {string} action
   * @param {object[]} models
   * @return {Promise<T>}
   */
  public invoke<T>(action: string, ...models: object[]): Promise<T> {

    return this.callProcedure<T>(action, ...models);

  }

  /**
   * Run the given action against the mysql database store procedure
   *
   * @param {string} action
   * @param {object[]} models
   * @return {Promise<T>}
   */
  public callProcedure<T>(action: string, ...models: object[]): Promise<T> {

    return new Promise(async (resolve, reject) => {

      const conn = Mysql.createConnection(this.getConnectionConfig());

      conn.query(this.prepareAction(action, models).join(';'), (error: Mysql.MysqlError | null, results: T) => {

        if (error) {

          reject(error);

          return;
        }

        resolve(results);

      });

      conn.end();

    });
  }
}


// Facade implementation
export const Invoker = new MysqlInvoker({multipleStatements: true});