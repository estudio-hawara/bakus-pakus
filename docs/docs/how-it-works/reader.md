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

#### Signature

```typescript
step(): void;
```

#### Example

```typescript
reader.step();
```

### Reset

The reset method moves the cursor back to the beginning of the source.

#### Signature

```typescript
reset(): void;
```

#### Example

```typescript
reader.source();
```

### Skip spaces

The skip spaces method moves the cursor ignoring whitespaces until it finds a character that's not a whitespace.

#### Signature

```typescript
skipSpaces(): void;
```

#### Example

```typescript
reader.skipSpaces();
```

### Skip characters

The skip characters method advances the cursor a given number of steps.

#### Signature

```typescript
skipCharacters(count: number = 0): void;
```

#### Example

```typescript
reader.skipCharacters(2);
```

### Read character

The read character method returns the value of the character under the current position of the cursor.

#### Signature

```typescript
readCharacter(): string;
```

#### Example

```typescript
reader.readCharacter(); // i
```

### Read characters

The read characters method returns a given number of the characters starting at the current position of the cursor.

#### Signature

```typescript
readCharacters(count: number = 1): string;
```

#### Example

```typescript
reader.readCharacters(10); // identifier
```

### Reading a slice

The read slice method facilitates reading a slice of text, regardless of the current position of the cursor.

#### Signature

```typescript
readSlice(start: number, end: number): string;
```

#### Example

```typescript
reader.readSlice(22, 46); // { letter | digit | " " }
```

### Is reading

The is reading method returns true or false whether the reader is currently over a given string.

#### Signature

```typescript
isReading(reference: string): boolean;
```

#### Example

```typescript
reader.isReading('{'); // ide
```

### Current position

The current position of the cursor can be obtained with detail through the position, line, column and finished attributes.

```typescript
reader.position;  // Current position index
reader.line;      // Current line number
reader.column;    // Current column number
reader.finished;  // Whether parsing is complete
```