export type PromiseReject = (reason?: any) => void;

export type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;

export type ActionParams = Array<string | number | bigint | { [key: string]: string | number | bigint | boolean | null } | boolean | null>;