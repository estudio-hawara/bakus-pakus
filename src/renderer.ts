import { Parser } from '@app/parser';

export class Renderer
{
    #parser: Parser;

    constructor(
        parser: Parser = new Parser(),
    ) {
        this.#parser = parser;
    }
}