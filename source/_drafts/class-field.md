---
title:
date: 2017-07-11 11:11:11
tags: [JavaScript, Prop, Web]
categories: [他山之石, Web]
---


The ECMAScript proposal “[Class Fields](https://github.com/tc39/proposal-class-fields)” by Daniel Ehrenberg and Jeff Morrison is currently at stage 3. This blog post explains how it works.

Overview || 综述
---------------------------------------------------------

Field declarations:
<br>
领域声明：

``` javascript
    class MyClass {
        instanceProperty = 0;
        static staticProperty = 0;
    }
```

Private fields have names starting with a `#` and are only visible within the body of the class:
<br>
私有域的命名以'#'开头，并且只在Class内有访问的权限。

``` javascript
    class MyClass {
        #foo; // must be declared
        constructor(foo) {
            this.#foo = foo;
        }
        incFoo() {
            this.#foo++;
        }
    }
```

Fields || 领域
-----------------------------------------------------

With this proposal, objects now have two kinds of fields:
<br>
依据这个ES提议，对象如今有两种领域。

-   Properties, whose keys are strings or symbols.
    <br>
    属性，其
-   Private fields that have names. More on private fields later.
    还有很多
    <br>
    私有字段

Fields can be configured as follows:
<br>
字段可以配置如下：

-   Location of property:
    <br>
    嵌套列表
    -   Static: prefix `static`
    <br>
    Static有什么
    -   Instance: no prefix
    <br>
    实例没有前缀修饰符

-   Visibility and name. A field can be either:
    <br>
    另外一个嵌套列表
    -   A public property with a fixed name
    -   A public property with a computed key
    -   A private field with a fixed name
-   Initializer: optional

|                      | Location | Visibility/name |
|----------------------|----------|-----------------|
| foo;               | instance | public          |
| #foo;              | instance | private         |
| ['f'+'oo'];        | instance | computed        |
| static foo;       | static   | public          |
| static #foo;       | static   | private         |
| static ['f'+'oo']; | static   | computed        |

Initializers
-----------------------------------------------------------------

With an initializer, you create a property and assign it a value at the same time. In the following code, `= 0` is an initializer:
``` javascript
    class MyClass {
        x = 0;
        y = 0;
    }
```
This class is equivalent to:
``` javascript
    class MyClass {
        constructor() {
            this.x = 0;
            this.y = 0;
        }
    }
```
### Initializers are executed before the constructor  <a href="#initializers-are-executed-before-the-constructor" class="header-anchor">#</a>
``` javascript
    class MyClass {
        foo = console.log('initializer');
        constructor() {
            console.log('constructor');
        }
    }
    new MyClass();
    // Output:
    // initializer
    // constructor
```
Location of the field 
-----------------------------------------------------------------------------------

### Instance fields

Without any prefix, a declaration creates an instance field:
``` javascript
    class MyClass {
        foo = 123;
    }
    console.log(new MyClass().foo); // 123
    console.log(Reflect.ownKeys(new MyClass()));
        // ['foo']
```
### Class fields

Declarations with the prefix `static` create fields for classes:

``` javascript
    class MyClass {
        static foo = 123;
    }
    console.log(MyClass.foo); // 123
    console.log(Reflect.ownKeys(MyClass)); // ['foo']
        // ['length', 'name', 'prototype', 'foo']
```
`MyClass` has the properties `length` and `name`, because it is also a function.

Private visibility 
-----------------------------------------------------------------------------

There are [many relatively kludgy techniques](http://exploringjs.com/es6/ch_classes.html#sec_private-data-for-classes) for keeping class-related data private.

One common technique is to indicate which properties are considered private by prefixing their names with underscores:

``` javascript
    class Countdown {
        constructor(counter, action) {
            this._counter = counter;
            this._action = action;
        }
        dec() {
            if (this._counter < 1) return;
            this._counter--;
            if (this._counter === 0) {
                this._action();
            }
        }
    }
```
That doesn’t give you any protection. Such code can be changed to use the new private field feature in two steps:

1.  Replace each underscore with a hash symbol.
2.  Declare all private fields at the beginning of the class.

<!-- -->
``` javascript
    class Countdown {
        #counter;
        #action;

        constructor(counter, action) {
            this.#counter = counter;
            this.#action = action;
        }
        dec() {
            if (this.#counter < 1) return;
            this.#counter--;
            if (this.#counter === 0) {
                this.#action();
            }
        }
    }
```

`Countdown` does not have any instance properties:

    const countdown = new Countdown(5, () => {});
    Reflect.ownKeys(countdown); // []

### Details

In the spec, private fields are managed via a data structure that is attached to objects. That is, private fields are roughly handled as follows.

``` javascript
    {
        const _counter = Symbol();
        const _action = Symbol();

        class Countdown {

            __PrivateFieldValues__ = {
                [_counter]: undefined,
                [_action]: undefined,
            };

            constructor(counter, action) {
                this.__PrivateFieldValues__[_counter] = counter;
                this.__PrivateFieldValues__[_action] = action;
            }

            ···
        }
    }
```

A consequence of this approach is that you can only access private properties if you are inside the body of a class; access to `this` does not give you access to private data. In other words, you need to know the right symbol to access the data (`__PrivateFieldValues__` is not fully protected, but the corresponding data structure in the spec is).

More information in the spec: Sect. “[Private Names and references](https://tc39.github.io/proposal-class-fields/#sec-private-names)”

### Not yet supported

Two elements of classes cannot yet be private:

-   Method definitions
-   Setters and getters

[An upcoming proposal](https://github.com/littledan/proposal-private-methods) that fills this gap is currently at stage 2.

Trying out this proposal
-----------------------------------------------------------------------------------------

If you switch on stages 2+ in [the Babel REPL](https://babeljs.io/repl/), you can play with the features of this proposal.