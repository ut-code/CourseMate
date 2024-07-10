# CORS test

# how to run test

0. cd into test/cors
1. run `./compile.sh`. this compiles ./static/script.ts -> ./static/script.js
2. run `npx ts-node servers/origin.ts`. this serves as the base server (localhost:3000)
3. run `npx ts-node servers/qualified.ts` and check all buttons work.
4. run `npx ts-node servers/unqualified.ts` and check all buttons fail.
