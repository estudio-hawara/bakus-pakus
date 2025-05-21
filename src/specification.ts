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

export const ebnfSpecification = new Specification;

// Whitespace
ebnfSpecification.add(/^\s+/, null);
ebnfSpecification.add(/^\(\*.*?\*\)/, null);

// Assignment operator
ebnfSpecification.add(/^=/, '=');

// Group symbols
ebnfSpecification.add(/^\(/, '(');
ebnfSpecification.add(/^\)/, ')');

// Repetition symbols
ebnfSpecification.add(/^\{/, '{');
ebnfSpecification.add(/^\}/, '}');

// Optional symbols
ebnfSpecification.add(/^\[/, '[');
ebnfSpecification.add(/^\]/, ']');

// Special symbols
ebnfSpecification.add(/^\?/, '?');
ebnfSpecification.add(/^\?/, '?');

// Choice symbol
ebnfSpecification.add(/^\|/, '|');

// Sequence symbol
ebnfSpecification.add(/^\,/, ',');

// Rule terminator operator
ebnfSpecification.add(/^;/, ';');

// Identifier
ebnfSpecification.add(/^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/, 'identifier');

// Single and double quoted terminals
ebnfSpecification.add(/^"[A-Za-z0-9\[\]\{\}\(\)<>=\|\.,`;\s]+"/, 'terminal');
ebnfSpecification.add(/^`[A-Za-z0-9\[\]\{\}\(\)<>=\|\.,";\s]+`/, 'terminal');
