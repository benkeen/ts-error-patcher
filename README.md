# ts-error-patcher

Parses a codebase and suppresses all specific typescript errors on a per-file basis. Useful after changing global linting or tsconfig settings. Now you don't have to put in a massive, risky Big Bang PR to fix every last one. Instead, you can run this script and upgrade each file at your leisure.

Usage:

```
tsc --noEmit path/to/index.ts | node parser.js
```

This passes in the list of errors to the `parser.js` script. That then prepends a suppression comment to the top of each file. At the time of writing, TS doesn't support suppressing specific messages on a per file basis (!), so the comments just suppresses everything. It does list the particular TS errors on the comment line, just to be specific.
