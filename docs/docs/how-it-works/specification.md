---
sidebar_position: 2
---

# Defining a specification

Rules and specification provide flexible pattern matching utilities for tokenization and parsing.

## Rules

A rule represents a regex pattern with an associated type for pattern matching.

```typescript
import { Rule } from 'choo-choo';

const rule = new Rule(/^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/, 'identifier');
```

### Properties

- **pattern**: The regext to be matched.
- **type**: The type of token represented by the pattern.

### Match

Checks if the input string matches the rule's regex pattern.

#### Signature

```typescript
match(input: string): boolean;
```

#### Example

```typescript
rule.match('identifier'); // true
rule.match('identifier with spaces'); // true
rule.match('¡invalid identifier!'); // false
```

## Specification

The `Specification` class manages a collection of rules.

```typescript
import { Specification } from 'choo-choo';

const specification = new Specification();
```

### Properties

* **rules**: the list of rules that have been registered.

### Add

Adds a new rule to the specification.

#### Signature

```typescript
add(pattern: RegExp, type: string): void;
```

#### Example

```typescript
specification.add(/^[a-zA-Z]+/, 'identifier');
specification.add(/^\d+/, 'number');
```

## The EBNF specification

A preconfigured specification is provided with the `ebnf` name. It contains the actual patterns that are going to be used by the tokenizer when an explicit specification isn't provided.

```typescript
import { ebnf } from 'choo-choo';
```
