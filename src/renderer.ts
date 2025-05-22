import { Parser } from './parser';

export class Renderer
{
    #parser: Parser;

    constructor(
        parser: Parser = new Parser(),
    ) {
        this.#parser = parser;
    }
}