---
sidebar_position: 2
---

# Defining a specification

The `Rule` and `Specification` classes provide a flexible pattern matching utility for tokenization and parsing.

## Defining rules

A rule represents a regex pattern with an associated type for pattern matching.

```typescript
import { Rule } from 'bakus-pakus';

const rule = new Rule(pattern: RegExp, type: string);
```

### Methods

#### `match(input: string): boolean`

Checks if the input string matches the rule's regex pattern.

```typescript
const rule = new Rule(
  /^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/, 
  'identifier'
);

console.log(rule.match('identifier')); // true
console.log(rule.match('identifier with spaces')); // true
console.log(rule.match('¡invalid identifier!')); // false
```

## Defining specifications

The `Specification` class manages a collection of rules.

### Methods

#### `add(pattern: RegExp, type: string)`
Adds a new rule to the specification.

```typescript
import { Specification } from 'bakus-pakus';

const spec = new Specification();

// Add rules for different token types
spec.add(/^[a-zA-Z]+/, 'identifier');
spec.add(/^\d+/, 'number');
```

#### `rules: Rule[]`

Retrieves the list of rules in the specification.

```typescript
// Access rules
console.log(spec.rules.length); // Number of rules
```

## The EBNF specification

A preconfigured specification is provided with the `ebnfSpecification` name. This specification contains the actual patterns used by default.

```typescript
import { Specification } from 'bakus-pakus';

// List the supported tokens
ebnfSpecification.rules.forEach(rule => { 
    if (rule.type == null) return;
    console.log(rule.type);
});
```