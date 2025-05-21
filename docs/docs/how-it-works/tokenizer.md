---
sidebar_position: 3
---

# Tokenizing a source text

## Tokenizer

The `Tokenizer` class is responsible for breaking down the input source code into tokens based on a set of rules defined in a given specification. If no specification is explicitly provided, the EBNF (Extended Backus-Naur Form) specification is used.

### Dependencies

This class utilizes a [reader](reader) to read through the source code and a [specification](specification) to define how different parts of the source code should be tokenized.

### Properties

* **position**: The current position in the source code.
* **line**: The current line number in the source code.
* **column**: The current column number in the source code.
* **finished**: A boolean indicating whether the end of the source code has been reached.
* **source**: The entire source code being tokenized.

### Constructor

During construction we can customize the tokenizer so that it uses an alternative reader, or specification. The constructor will usually be called without arguments, anyway.

#### Signature

```typescript
constructor(
    reader: Reader = new Reader,
    specification: Specification = ebnf,
): void;
```

#### Example

```typescript
import { Tokenizer } from 'bakus-pakus';

const tokenizer = new Tokenizer;
```

### Read

The read method tells the tokenizer to use its reader to load a specific source in memory. When the read method is called, the cursor of the reader is reset to the start.

#### Signature

```typescript
read(source: string): void;
```

#### Example

```typescript
tokenizer.read('identifier = letter , { letter | digit | " " }, { letter | digit } ;');
```

### Reset

With reset we can move the cursor of the reader to force the tokenizer to restart processing the source.

#### Signature

```typescript
reset(): void;
```

#### Example

```typescript
tokenizer.reset();
```

### Get the next token

The main functionality of the tokenizer is to return the next token in the source code based on the defined rules. If no more tokens are available, returns null.

#### Signature

```typescript
getNextToken(): Token | null;
```

#### Example

```typescript
tokenizer.read('identifier = letter , { letter | digit | " " }, { letter | digit } ;');

while (!tokenizer.finished) {
    const token = tokenizer.getNextToken();
    if (! token) continue;
    console.log(token.value);
}
```

##### Output

```
letter
=
uppercase letter
|
lowercase letter
;
```
