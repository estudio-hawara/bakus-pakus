import { Reader } from "@app/reader";
import { Specification, ebnf } from "@app/specification";

export class Token
{
    #type: string;
    #value: string;

    constructor(
        type: string,
        value: string,
    ) {
        this.#type = type;
        this.#value = value;
    }

    get type(): string
    {
        return this.#type;
    }

    get value(): string
    {
        return this.#value;
    }
}

export class Tokenizer
{
    #reader: Reader;
    #specification: Specification;

    constructor(
        reader: Reader = new Reader,
        specification: Specification = ebnf,
    ) {
        reader.reset();
        this.#reader = reader;
        this.#specification = specification;
    }

    get position(): number
    {
        return this.#reader.position;
    }

    get line(): number
    {
        return this.#reader.line;
    }

    get column(): number
    {
        return this.#reader.column;
    }

    get finished(): boolean
    {
        return this.#reader.finished;
    }

    get source(): string
    {
        return this.#reader.source;
    }

    read(source: string)
    {
        this.#reader.read(source);
    }

    reset()
    {
        this.#reader.reset();
    }

    getNextToken(): Token|null {
        if (this.finished)
            return null;

        const head = this.#reader.head();

        for (const rule of this.#specification.rules) {
            const value = rule.match(head);

            // If there was no match, try to process the next rule
            if (value == null)
                continue;

            this.#reader.skipCharacters(value.length);

            // Skip ignorable tokens (like white spaces)
            if (rule.type == null)
                return this.getNextToken();

            return new Token(rule.type, value);
        }

        throw new SyntaxError(`Unexpected token: "${head[0]}"`);
    }
}