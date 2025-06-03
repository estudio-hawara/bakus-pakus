import { Grammar } from '@app/factory';
import { Diagram } from '@app/railroad/diagram';

export class Renderer
{
    #grammar: Grammar;

    constructor(grammar: Grammar)
    {
        this.#grammar = grammar;
    }

    render(identifier: string): string
    {
        return '';
    }
}