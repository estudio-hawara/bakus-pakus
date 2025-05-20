# Bakus Pakus

**Bakus Pakus** is a JavaScript library that generates visual railroad diagrams from Extended Backus-Naur Form (EBNF) grammars. Railroad diagrams provide an intuitive, graphical representation of formal language syntax rules, making it easier to understand and document complex grammars.

The library partially supports the ISO/IEC 14977 EBNF syntax and includes features like:

- Optional sequences `[...]`
- Repetitions `{...}`
- Grouping `(...)`
- Choices `|`
- Sequences `,`
- Terminal strings `" ... "`
- Comment blocks `(* ... *)`

Check [docs/ebnf.ebnf](docs/ebnf.ebnf) for specific details of the supported features.

> [!NOTE]
> I started writing this library while studying the [Parser from scratch](http://dmitrysoshnikov.com/courses/parser-from-scratch/) course from [@dmitrysoshnikov](https://github.com/dmitrysoshnikov), so you may find several similarities with his approach to recursive descent parser. Following his course[s] will definitely help you understanding this codebase.

> [!WARNING]
> Until this library is considered battle ready, it won't be uploaded to any package repository. Also, no releases will be created until that point. Use it at your discretion and remember that it's an unfinished piece of software shared without any warrant.

## Install

```bash
git clone https://github.com/estudio-hawara/bakus-pakus
cd bakus-pakus
pnpm install
```

## Tests

### Run all the tests

Run the unit test suite to verify functionality:

```bash
pnpm run test
```

### Run the coverage checks

Generate a test coverage report to ensure code quality:

```bash
pnpm run coverage
```

## Build

### Recreate all the builds

Build both ESM and CommonJS versions of the library:

```bash
pnpm run build
```

### Recreate the ECMAScript Module

Generates the ES modules build in `dist/esm`:

```bash
pnpm run build:esm
```

### Recreate the CommonJS Build

Generates the CommonJS build in `dist/cjs`:

```bash
pnpm run build:cjs
```

## References

- [Building a parser from scratch](https://www.youtube.com/watch?v=4m7ubrdbWQU&list=PLGNbPb3dQJ_5FTPfFIg28UxuMpu7k0eT4)
- [Crafting interpreters](https://craftinginterpreters.com)