import * as Mysql from 'mysql';
import { ActionParams, PromiseReject, PromiseResolve } from './contracts';

const key = Symbol.for('MYSQL_INVOKER_NAMESPACE_1580fa11-e9e2-4ea7-a3ca-435bb97c21e2');

export class MysqlInvoker {
  
  public constructor(private connectionConfig: Mysql.PoolConfig | Mysql.ConnectionConfig = {}) {
  }
  
  /**
   * Clean up any connection object in memory
   */
  public static flush() {
    
    delete (global as any)[key];
    
  }
  
  /**
   * Set the global connection configuration
   *
   * @param connectionConfig
   */
  public static config(connectionConfig: Mysql.PoolConfig) {
    
    const globalSymbols = Object.getOwnPropertySymbols(global);
    
    const hasNamespace = (globalSymbols.indexOf(key) > -1);
    
    if (!hasNamespace) (global as any)[key] = connectionConfig;
    
  }
  
  /**
   *
   * @param value
   */
  private generatePlaceholder(value: any): string {
    
    const placeholders: any[] = [];
    
    if (typeof value === 'object' && value !== null) {
      
      placeholders.push(...Object.keys(value).map(_key => '?'))
      
    } else {
      
      placeholders.push('?');
      
    }
    
    return placeholders.join(',');
  }
  
  /**
   * Prepare the action for execution
   *
   * @param initiator
   * @param action
   * @param params
   * @return {object}
   */
  
  private prepareAction(initiator: string, action: string, ...params: ActionParams): string[] {
    
    if (typeof params[0] === 'object') {
      
      return params.map((model) => {
        
        const sql = `${ initiator } ${ action }(${ this.generatePlaceholder(model) })`;
        
        return Mysql.format(sql, typeof model === 'object' ? Object.values(model as object) : [ model ]);
        
      });
      
    } else {
      
      return [ Mysql.format(`${ initiator } ${ action }(${ params.map(_ => '?') })`, params) ];
      
    }
    
  }
  
  /**
   * Get connection config
   *
   * @return {Mysql.PoolConfig | Mysql.ConnectionConfig}
   */
  public getConnectionConfig(): Mysql.PoolConfig | Mysql.ConnectionConfig {
    
    const config: Mysql.ConnectionConfig = (global as any)[key] || {};
    
    return Object.assign(config, this.connectionConfig);
    
  }
  
  /**
   * Invoke the process using a connection from the pool
   *
   * @param initiator
   * @param action
   * @param params
   * @return {Promise<T>}
   */
  private invokeByConnectionPool<T>(initiator: string, action: string, ...params: ActionParams): Promise<T> {
    
    return new Promise(async (resolve, reject) => {
      
      Mysql.createPool(this.getConnectionConfig()).getConnection((error, conn) => {
        
        if (error) return reject(error);
        
        conn.query(this.prepareAction(initiator, action, ...params).join(';'), this.getOnInvokeListener(resolve, reject, conn.release));
        
      });
      
    });
    
  }
  
  /**
   * Invoke the process using a regular connection
   *
   * @param initiator
   * @param action
   * @param params
   * @return {Promise<T>}
   */
  private invokeByConnection<T>(initiator: string, action: string, ...params: ActionParams): Promise<T> {
    
    return new Promise(async (resolve, reject) => {
      
      const conn = Mysql.createConnection(this.getConnectionConfig());
      
      conn.query(this.prepareAction(initiator, action, ...params).join(';'), this.getOnInvokeListener(resolve, reject));
      
      conn.end();
      
    });
  }
  
  /**
   * Retrieve on invoke listener
   *
   * @param resolve
   * @param reject
   * @param release
   */
  private getOnInvokeListener<T>(resolve: PromiseResolve<T>, reject: PromiseReject, release?: Function): Mysql.queryCallback {
    
    return (error: Mysql.MysqlError | null, results: T) => {
      
      if (release) release();
      
      if (error) {
        
        reject(error);
        
        return;
        
      }
      
      resolve(results);
      
    }
    
  }
  
  /**
   * Invoke the process by resolving a connection pool or regular connection
   *
   * @param initiator
   * @param action
   * @param params
   * @return {Promise<T>}
   */
  private invoke<T>(initiator: string, action: string, ...params: ActionParams): Promise<T> {
    
    if (this.getConnectionConfig().hasOwnProperty('connectionLimit')) {
      
      return this.invokeByConnectionPool<T>(initiator, action, ...params);
      
    } else {
      
      return this.invokeByConnection<T>(initiator, action, ...params);
      
    }
    
  }
  
  /**
   * Run the given action against the mysql database store procedure
   *
   * @param {string} action
   * @param {object[]} params
   * @return {Promise<T>}
   */
  public invokeProcedure<T>(action: string, ...params: ActionParams): Promise<T> {
    
    return this.invoke('CALL', action, ...params);
    
  }
  
  /**
   * Run the given action against the mysql database store procedure
   *
   * @param {string} action
   * @param {object[]} params
   * @return {Promise<T>}
   */
  public invokeFunction<T>(action: string, ...params: ActionParams): Promise<T> {
    
    return this.invoke('SELECT', action, ...params);
    
  }
  
}
