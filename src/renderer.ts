import { Grammar } from '@app/factory';

export class Renderer
{
    #grammar: Grammar;

    constructor(grammar: Grammar)
    {
        this.#grammar = grammar;
    }

    render(identifier: string): string | undefined
    {
        const rule = this.#grammar.rule(identifier);

        return rule?.toDiagram().toString();
    }
}