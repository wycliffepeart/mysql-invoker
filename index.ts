import * as Mysql from 'mysql';

export class MysqlInvoker {

  /**
   * Create an instance of this service
   *
   * @param host
   * @param password
   * @param options
   */

  public constructor(private host: string, private password: string, private options?: Mysql.ConnectionConfig) {
  }

  /**
   * Create a mysql connection object
   *
   * @return {Mysql.Connection}
   */

  private createConnection(): Mysql.Connection {

    return Mysql.createConnection({
      ...this.options || {},
      host: this.host,
      password: this.password,
      user: 'application',
      database: 'invoker',
    });

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

      const conn = this.createConnection();

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
