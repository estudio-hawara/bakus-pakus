---
sidebar_position: 1
---

# Getting Started

## Overview

**Bakus-Pakus** is a lightweight JavaScript library designed for creating railroad diagrams from Extended Backus-Naur Form (EBNF) grammars. This library provides a simple and efficient way to visualize formal grammar specifications.

## Key Features

- Support for both EBNF grammar notation
- Generates railroad diagrams to help visualize complex language syntax
- TypeScript support with full type definitions
- Lightweight and easy to integrate into your projects

## Installation

You can install Bakus-Pakus using your preferred package manager:

```bash
# Using npm
npm install bakus-pakus

# Using yarn
yarn add bakus-pakus

# Using pnpm
pnpm add bakus-pakus
```

## Basic Usage

```typescript
import { Parser, Renderer } from 'bakus-pakus';

// Define your grammar
const grammar = `
  letter = uppercase letter | lowercase letter ;

  uppercase letter =
      "A" | "B" | "C" | "D" | "E" | "F" | "G"
    | "H" | "I" | "J" | "K" | "L" | "M" | "N"
    | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
    | "V" | "W" | "X" | "Y" | "Z";

  lowercase letter =
      "a" | "b" | "c" | "d" | "e" | "f" | "g"
    | "h" | "i" | "j" | "k" | "l" | "m" | "n"
    | "o" | "p" | "q" | "r" | "s" | "t" | "u"
    | "v" | "w" | "x" | "y" | "z" ;
`;

// Parse the grammar
const parser = new Parser();
const parsed = parser.parse(grammar);

// Render a diagram
const renderer = new Renderer();
const rendered = renderer.render(parsed);
```
