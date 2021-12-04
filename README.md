# Base Project for Employing the TDD Discipline

This is a NodeJS project with the following technologies

- Yarn package manager
- TypeScript
- Jest test runner

## Run Tests

To run tests, simply execute the following:

```
./test.sh
```

If you add the optional `--watch` flag, the tests will run automatically with every change to your code.

```
./test.sh --watch
```

There is a failing test in the file `project.spec.ts`. It is recommended to remove that file before witing your own tests. You should never commit with any failing test.

## Inspiration

This template was originally inspired by James Shore's [TDD Livestream][James Shore video] from 2020. He uses JavaScript/Mocha for his tests.

The tool he uses in his video can be found [here][James Shore code].

[James Shore video]:https://youtu.be/nlGSDUuK7C4
[James Shore code]: https://github.com/jamesshore/livestream
