export const connectionCongif = (options?: object) => ({
    host: 'localhost',
    user: 'application', 
    password: '__Password1', 
    database: 'invoker',
    ...options
});
