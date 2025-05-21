export class Rule
{
    #pattern: RegExp;
    #type: string|null;

    constructor(pattern: RegExp, type: string|null)
    {
        this.#pattern = pattern;
        this.#type = type;
    }

    get pattern(): RegExp {
        return this.#pattern;
    }

    get type(): string|null {
        return this.#type;
    }

    match(value: string): string|null {
        const matched = this.#pattern.exec(value);
        if (! matched)
            return null;
        return matched[0];
    }
}

export class Specification
{
    #rules: Rule[] = [];

    add(pattern: RegExp, type: string|null)
    {
        const rule = new Rule(pattern, type);
        this.#rules.push(rule);
    }

    get rules(): Rule[]
    {
        return [...this.#rules];
    }
}

export const ebnf = new Specification;

// Whitespace
ebnf.add(/^\s+/, null);
ebnf.add(/^\(\*.*?\*\)/, null);

// Assignment operator
ebnf.add(/^=/, '=');

// Group symbols
ebnf.add(/^\(/, '(');
ebnf.add(/^\)/, ')');

// Repetition symbols
ebnf.add(/^\{/, '{');
ebnf.add(/^\}/, '}');

// Optional symbols
ebnf.add(/^\[/, '[');
ebnf.add(/^\]/, ']');

// Special symbols
ebnf.add(/^\?/, '?');
ebnf.add(/^\?/, '?');

// Choice symbol
ebnf.add(/^\|/, '|');

// Sequence symbol
ebnf.add(/^\,/, ',');

// Rule terminator operator
ebnf.add(/^;/, ';');

// Identifier
ebnf.add(/^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/, 'identifier');

// Single and double quoted terminals
ebnf.add(/^"[^"]+"/, 'terminal');
ebnf.add(/^`[^`]+`/, 'terminal');
