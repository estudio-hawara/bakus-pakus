---
sidebar_position: 1
---

# Reading a source text

The `Reader` class is a text parsing utility that provides fine-grained control over text traversal and inspection.

## Usage

### Basic Initialization

```typescript
import { Reader } from 'bakus-pakus';

const reader = new Reader();
reader.read('identifier = letter , { letter | digit | " " }, { letter | digit } ;');
```

### Key Methods

The reader offers methods for moving a cursor around the given text.

#### Navigation

```typescript
// Step to next character
reader.step(); 

// Reset to the beginning of the source
reader.reset();

// Skip whitespaces
reader.skipSpaces();

// Skip specific number of characters
reader.skipCharacters(2);
```

#### Reading Characters

It also offers methods for reading from the current position of the cursor.

```typescript
// Read current character
reader.readCharacter(); // returns 'i'

// Read multiple characters
reader.readCharacters(10); // returns 'identifier'

// Read slice of source
reader.readSlice(22, 46); // returns '{ letter | digit | " " }'
```

#### State Checking

The current position of the cursor can be obtained with detail.

```typescript
// Check current position status
console.log(reader.position);  // Current position index
console.log(reader.line);      // Current line number
console.log(reader.column);    // Current column number
console.log(reader.finished);  // Whether parsing is complete

// Check current character
reader.isReading('x');  // Returns boolean if current character matches
```

### Properties

- `source`: The original input string
- `position`: Current character index
- `line`: Current line number
- `column`: Current column number
- `finished`: Whether parsing has completed

## Example

```typescript
const reader = new Reader();
reader.read('identifier = letter , { letter | digit | " " }, { letter | digit } ;');

while (!reader.finished) {
  console.log(reader.readCharacter());
  reader.step();
}
```
