export type Rhs =
    | Identifier
    | Terminal
    | Special
    | Group
    | Repetition
    | Optional
    | Choice
    | Sequence;

export class Grammar
{
    #rules: Rule[];

    constructor(rules: Rule[])
    {
        this.#rules = rules;
    }

    get rules(): Rule[]
    {
        return this.#rules;
    }

    toDictionary(): object
    {
        return {
            type: 'Grammar',
            rules: this.#rules.map(r => r.toDictionary()),
        };
    }
}

export class Rule
{
    #identifier: Identifier;
    #value: Rhs;

    constructor(identifier: Identifier, value: Rhs)
    {
        this.#identifier = identifier;
        this.#value = value;
    }

    get identifier(): Rhs
    {
        return this.#identifier;
    }

    get value(): Rhs
    {
        return this.#value;
    }

    toDictionary(): object
    {
        return {
            type: 'Rule',
            identifier: this.identifier.toDictionary(),
            value: this.value.toDictionary(),
        };
    }
}

export class Group
{
    #value: Rhs;

    constructor(value: Rhs)
    {
        this.#value = value;
    }

    get value(): Rhs
    {
        return this.#value;
    }

    toDictionary(): object
    {
        return {
            type: 'Group',
            value: this.value.toDictionary(),
        };
    }
}

export class Repetition
{
    #value: Rhs;

    constructor(value: Rhs)
    {
        this.#value = value;
    }

    get value(): Rhs
    {
        return this.#value;
    }

    toDictionary(): object
    {
        return {
            type: 'Repetition',
            value: this.value.toDictionary(),
        };
    }
}

export class Optional
{
    #value: Rhs;

    constructor(value: Rhs)
    {
        this.#value = value;
    }

    get value(): Rhs
    {
        return this.#value;
    }

    toDictionary(): object
    {
        return {
            type: 'Optional',
            value: this.value.toDictionary(),
        };
    }
}

export class Choice
{
    #left: Rhs;
    #right: Rhs;

    constructor(left: Rhs, right: Rhs)
    {
        this.#left = left;
        this.#right = right;
    }

    get left(): Rhs
    {
        return this.#left;
    }

    get right(): Rhs
    {
        return this.#right;
    }

    toDictionary(): object
    {
        return {
            type: 'Choice',
            left: this.left.toDictionary(),
            right: this.right.toDictionary(),
        };
    }
}

export class Sequence
{
    #left: Rhs;
    #right: Rhs;

    constructor(left: Rhs, right: Rhs)
    {
        this.#left = left;
        this.#right = right;
    }

    get left(): Rhs
    {
        return this.#left;
    }

    get right(): Rhs
    {
        return this.#right;
    }

    toDictionary(): object
    {
        return {
            type: 'Sequence',
            left: this.left.toDictionary(),
            right: this.right.toDictionary(),
        };
    }
}

export class Identifier
{
    #value: string;

    constructor(value: string)
    {
        this.#value = value;
    }

    get value(): string
    {
        return this.#value;
    }

    toDictionary(): object
    {
        return {
            type: 'Identifier',
            value: this.value,
        };
    }
}

export class Terminal
{
    #value: string;

    constructor(value: string)
    {
        this.#value = value;
    }

    get value(): string
    {
        return this.#value;
    }

    toDictionary(): object
    {
        return {
            type: 'Terminal',
            value: this.value,
        };
    }
}

export class Special
{
    #value: string;

    constructor(value: string)
    {
        this.#value = value;
    }

    get value(): string
    {
        return this.#value;
    }

    toDictionary(): object
    {
        return {
            type: 'Special',
            value: this.value,
        };
    }
}

export class Factory
{
    Grammar(rules: Rule[]): Grammar
    {
        return new Grammar(rules);
    }

    Rule(identifier: Identifier, value: Rhs): Rule
    {
        return new Rule(identifier, value);
    }

    Group(value: Rhs): Group
    {
        return new Group(value);
    }

    Repetition(value: Rhs): Repetition
    {
        return new Repetition(value);
    }

    Optional(value: Rhs): Optional
    {
        return new Optional(value);
    }

    Choice(left: Rhs, right: Rhs): Choice
    {
        return new Choice(left, right);
    }

    Sequence(left: Rhs, right: Rhs): Sequence
    {
        return new Sequence(left, right);
    }

    Identifier(value: string): Identifier
    {
        return new Identifier(value);
    }

    Terminal(value: string): Terminal
    {
        return new Terminal(value);
    }

    Special(value: string): Special
    {
        return new Special(value);
    }
}