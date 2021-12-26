## TODOS
[x] Move to typescript
[x] Restructure project code + Models to es6 classes
[x] add configs (convict)
[x] Basic auth to endpoints | Sequelize
[] Basic validation of posted params to endpoint
    >> izi middleware mbili zitakua chained kwa array [mid1, mid2]
[x] Implement endpoints and accompanying controllers
[] Add migrations module

- Add Caching of DB results
- BONUS: Add styling linting
- Containerize make ready for deployment
- Add Admin type of profile and create middleware to only allow admins access admin routes
- Add users table to create user accounts to allow password based login auth, add mapping of users to profiles - one user can have multiple profiles
- Add register route to create user account and profile (can be 2 steps)


Recommendations:
- Tests and Coverage
- Logging
- Consider how this containerized version can be optimized for horizontal scaling - containerization is first step but what else about app code?
- concurrency, can we get this api to process 1m requests? and what are the things to consider to make that possible
- simple frontend with benchmarks for throughput
- in the balances/deposit/:userId should probably remove the :userId param - already have it passed in header