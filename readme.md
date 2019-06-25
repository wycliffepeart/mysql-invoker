# Mysql Invoker


> ### Still in Development

[Introduction](#introduction) <br />
[Installation](#installation) <br />
[Getting Started](#getting-started) <br />
[MIT License](#mit-license) <br />

****

## [Introduction](#introduction)

This module enables you to invoke stored procedure and function that was defined explicitly in your mysql database. At runtime mysql invoker will automatically format the arguments for your stored procedure and function using the `object` that was pass to it.


## [Installation](#installation)

This is done using (NPM) node package manager just copy and past in your terminal and npm will manage the rest.

```npm
npm i mysql-invoker --save
```

## [Getting Started](#getting-started)

To get started with the module, after installation just import the module and then use the destructuring construct to access the implementated class.

```js
import { MysqlInvoker } from 'mysql-invoker';
```

**The Invoker instance**

Create a new instance of mysql invoker and pass at least the minimum required configuration options to it, [see config options  for more information](https://github.com/mysqljs/mysql#connection-options)

```js
const mysql = new MysqlInvoker( { /** Config Options **/ } );
```

**Basic Connection Configuration options**

Each instance will require a set of configuration options, these options will use when connecting to the database.

| Properties       | Type     | Required   | Description
|----------------- | ---------| ---------:|----------------------------------
| **host**   | `string` | Yes       | The host name of the database
| **user** | `string` | Yes       | The user name used by the user
| **database**      | `string` | Yes  | Database trying to connect to
| **password**      | `string` | Yes  | The password used by the user
| **multipleStatements**   | `boolean` | Optional  | Allow for multiple statement to be excecute

## [Invoking a stored procedure](#configuration-options)

When invoking a stored procedure or function you need to first create the argument object model. This model will contain all the arguments need to carry out the excecution process.


**Create the store procedure argumant model**

```ts
const createUserArg: any = {

    name: 'Wycliffe Peart'
}
```

>  Please note that the order of the arguments in the model must match the order of the stored procedure and function argument list.


```ts

async function createUser(createUserArg: object): Promise<any[]>{

    const mysql = new MysqlInvoker( { /** Config Options **/ } );

    return await mysql.invoke<any[]>('createUser', createUserArg);
}
```

## [MIT License](#min-license)

Copyright (c) 2018 Wycliffe Peart

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.