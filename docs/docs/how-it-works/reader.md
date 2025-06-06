---
sidebar_position: 1
---

# Reading a source text

## Reader

The reader is a text parsing utility that provides fine-grained control over text traversal and inspection.

```typescript
import { Reader } from 'choo-choo';

const reader = new Reader();
reader.read('identifier = letter , { letter | digit | " " }, { letter | digit } ;');
```

### Properties

- **source**: The original input string.
- **position**: Current character index.
- **line**: Current line number.
- **column**: Current column number.
- **finished**: Whether parsing has completed.

### Step

The step method moves the cursor to the next character.

```typescript
// Signature
step(): void;

// Example
reader.step();
```

### Reset

The reset method moves the cursor back to the beginning of the source.

```typescript
// Signature
reset(): void;

// Example
reader.source();
```

### Skipping Spaces

The skip spaces method moves the cursor ignoring whitespaces until it finds a character that's not a whitespace.

```typescript
// Signature
skipSpaces(): void;

// Example
reader.skipSpaces();
```

### Skipping Characters

The skip characters method advances the cursor a given number of steps.

```typescript
// Signature
skipCharacters(count: number = 0): void;

// Example
reader.skipCharacters(2);
```

### Reading a Character

The read character method returns the value of the character under the current position of the cursor.

```typescript
// Signature
readCharacter(): string;

// Example
reader.readCharacter(); // i
```

### Reading Characters

The read characters method returns a given number of the characters starting at the current position of the cursor.

```typescript
// Signature
readCharacters(count: number = 1): string;

// Example
reader.readCharacters(10); // identifier
```

### Reading a Slice

The read slice method facilitates reading a slice of text, regardless of the current position of the cursor.

```typescript
// Signature
readSlice(start: number, end: number): string;

// Example
reader.readSlice(22, 46); // { letter | digit | " " }
```

### Is Reading

The is reading method returns true or false whether the reader is currently over a given string.

```typescript
// Signature
isReading(reference: string): boolean;

// Example
reader.isReading('{'); // ide
```

### Current Position

The current position of the cursor can be obtained with detail through the position, line, column and finished attributes.

```typescript
reader.position;  // Current position index
reader.line;      // Current line number
reader.column;    // Current column number
reader.finished;  // Whether parsing is complete
```