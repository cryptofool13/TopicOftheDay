# Topic of the Day

I have the tendency to start many hobbies and feel guilty when I can't make time for all of them.
Instead of trying to remember all the things, I can store them as a Topic in this little JSON DB server.
Each day it is accessed, it returns one topic at random, keeping track of how many times it has been returned.

I would like to add functionality:

- to return only one topic per day
- to allow user to reject a topic and request another if its something they really don't want to/aren't able to do
- to keep track of when certain topics are returned to display a calendar UI

TODO:
- [ ] create Model Class to hide db implementation
  - [ ] ultimately to move to a remote db
- [ ] separate api routes from app.ts
- [ ] add more tests for api routes
  - [end-to-end tests](https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6)
- [x] decide on frontend stack
  - Svelte
