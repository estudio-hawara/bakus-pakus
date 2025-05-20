export class Rule
{
    #pattern: RegExp;
    #type: string;

    constructor(pattern: RegExp, type: string)
    {
        this.#pattern = pattern;
        this.#type = type;
    }


    get pattern(): RegExp {
        return this.#pattern;
    }

    get type(): string {
        return this.#type;
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