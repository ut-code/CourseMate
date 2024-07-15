/*
TypeScript Type "Annotation"s don't leak into the compiled JavaScript, even when operators such as `as` or `!` are used.
therefore, it's unsafe to trust the JSON type of the request to always match the type declaration.
for example,
when attacker sends a json like { username: "victim", password: { startsWith: "" } } ,
then 
```js
prisma.user.findUnique({where: {
  username: json.username,
  password: json.password,
}});
````
will return the user object without password verification.

TODO: consider using some third party validator such as [Zod](https://github.com/colinhacks/zod)


btw this is one of the reasons I don't like TypeScript
*/

// never throws.
function forceString(v: unknown): string {
  if (typeof v === "string") {
    return v;
  }
  return String(v);
}

// may throw if given `number` is not formatted well.
function forceNumber(v: unknown): number {
  if (typeof v === "number") {
    return v
  }
  return parseInt(forceString(v), 10);
}

// may throw.
function forceInt(v: unknown): number {
  return parseInt(forceNumber(v).toString(), 10);
}

// may throw.
function forceUint(v: unknown): number {
  const n = forceInt(v);
  if (n < 0) {
    // I'm no JavaScript, I won't convert negative value to positive for no reason
    throw new Error("forceUint called on negative value");
  }
  return n
}

export {
  forceString,
  forceNumber,
  forceInt,
  forceUint,
};
