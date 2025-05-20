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

    add(pattern: RegExp, type: string)
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

ebnfSpecification.add(/^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/, 'identifier');