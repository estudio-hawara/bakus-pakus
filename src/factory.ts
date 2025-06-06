import * as Railroad from "@app/railroad";

export type Rhs =
    | Identifier
    | Terminal
    | Special
    | Group
    | Repetition
    | Optional
    | Choice
    | Sequence;

abstract class Node
{
    abstract toDictionary(): object;
}

abstract class Diagramable extends Node
{
    abstract toDiagram(): Railroad.FakeSVG;

    abstract replace(replacements: Rule[]): Diagramable;
}

export class Grammar extends Node
{
    #rules: Rule[];

    constructor(rules: Rule[])
    {
        super();

        this.#rules = rules;
    }

    get rules(): Rule[]
    {
        return this.#rules;
    }

    rule(identifier: string, replace: boolean = false): Rule | undefined
    {
        const rule = this.#rules.find(r => (r.identifier as Identifier).value === identifier);

        if (! replace)
            return rule;
        
        return (rule?.replace(this.replacements(identifier)) as Rule);
    }

    replacements(identifier: string): Rule[]
    {
        return this.#rules.filter(r => (r.identifier as Identifier).value !== identifier);
    }

    toDictionary(): object
    {
        return {
            type: 'Grammar',
            rules: this.#rules.map(r => r.toDictionary()),
        };
    }
}

export class Rule extends Diagramable
{
    #identifier: Identifier;
    #value: Rhs;

    constructor(identifier: Identifier, value: Rhs)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.Diagram([
            new Railroad.Group(
                this.value.toDiagram(),
                this.#identifier.value,
            )
        ]);
    }

    replace(replacements: Rule[]): Diagramable
    {
        const value = this.value.replace(replacements);

        return new Rule((this.identifier as Identifier), (value as Rhs));
    }
}

export class Group extends Diagramable
{
    #value: Rhs;
    #label: string | null;

    constructor(value: Rhs, label: string | null = null)
    {
        super();

        this.#value = value;
        this.#label = label;
    }

    get value(): Rhs
    {
        return this.#value;
    }

    get label(): string | null
    {
        return this.#label;
    }

    toDictionary(): object
    {
        return {
            type: 'Group',
            value: this.value.toDictionary(),
        };
    }

    toDiagram(): Railroad.FakeSVG
    {
        if (! this.label)
            return this.value.toDiagram();
        else
            return new Railroad.Group(
                this.value.toDiagram(),
                this.label
            );
    }

    replace(replacements: Rule[]): Diagramable
    {
        const value = this.value.replace(replacements);

        return new Group((value as Rhs));
    }
}

export class BorrowedGroup extends Group
{
    constructor(value: Rhs, label: string | null = null)
    {
        super(value, label);
    }

    toDiagram(): Railroad.FakeSVG
    {
        if (! this.label)
            return this.value.toDiagram();
        else {
            const group = new Railroad.Group(
                this.value.toDiagram(),
                this.label
            );

            group.attributes.add('class', 'borrowed');

            return group;
        }
    }
}

export class Repetition extends Diagramable
{
    #value: Rhs;

    constructor(value: Rhs)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.OneOrMore(this.value.toDiagram());
    }

    replace(replacements: Rule[]): Diagramable
    {
        const value = this.value.replace(replacements);

        return new Repetition((value as Rhs));
    }
}

export class Optional extends Diagramable
{
    #value: Rhs;

    constructor(value: Rhs)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.ZeroOrMore(this.value.toDiagram());
    }

    replace(replacements: Rule[]): Diagramable
    {
        const value = this.value.replace(replacements);

        return new Optional((value as Rhs));
    }
}

export class Choice extends Diagramable
{
    #left: Rhs;
    #right: Rhs;

    constructor(left: Rhs, right: Rhs)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.Choice([
            this.left.toDiagram(),
            this.right.toDiagram(),
        ]);
    }

    replace(replacements: Rule[]): Diagramable
    {
        const left = this.left.replace(replacements);
        const right = this.right.replace(replacements);

        return new Choice((left as Rhs), (right as Rhs));
    }
}

export class Sequence extends Diagramable
{
    #left: Rhs;
    #right: Rhs;

    constructor(left: Rhs, right: Rhs)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.Sequence([
            this.left.toDiagram(),
            this.right.toDiagram(),
        ]);
    }

    replace(replacements: Rule[]): Diagramable
    {
        const left = this.left.replace(replacements);
        const right = this.right.replace(replacements);

        return new Sequence((left as Rhs), (right as Rhs));
    }
}

export class Identifier extends Diagramable
{
    #value: string;

    constructor(value: string)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.NonTerminal(this.value);
    }

    replace(replacements: Rule[]): Diagramable
    {
        const replacement = replacements.find(r => (r.identifier as Identifier).value === this.value);

        if (replacement)
            return new BorrowedGroup(replacement.value, this.#value);
        
        return this;
    }
}

export class Terminal extends Diagramable
{
    #value: string;

    constructor(value: string)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.Terminal(this.value);
    }

    replace(replacements: Rule[]): Diagramable
    {
        return this;
    }
}

export class Special extends Diagramable
{
    #value: string;

    constructor(value: string)
    {
        super();

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

    toDiagram(): Railroad.FakeSVG
    {
        return new Railroad.Terminal(this.value, {class: 'special'});
    }

    replace(replacements: Rule[]): Diagramable
    {
        return this;
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