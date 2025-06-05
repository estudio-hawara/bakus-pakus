import { Grammar, Identifier } from '@app/factory';

export class Renderer
{
    #grammar: Grammar;

    constructor(grammar: Grammar)
    {
        this.#grammar = grammar;
    }

    ruleNames(): string[]
    {
        return this.#grammar.rules.map(r => (r.identifier as Identifier).value);
    }

    render(identifier: string, replace: boolean = false): string | undefined
    {
        const rule = this.#grammar.rule(identifier, replace);

        return rule?.toDiagram().toString();
    }
}