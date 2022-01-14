# ts-error-patcher

Parses a codebase and suppresses all specific typescript errors on a per-file basis. Useful after changing global linting or tsconfig settings. Now you don't have to put in a massive, risky Big Bang PR to fix every last one. Instead, you can run this script and upgrade each file at your leisure.
