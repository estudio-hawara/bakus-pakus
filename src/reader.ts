export class Reader
{
    #position: number = 0;
    #line: number = 1;
    #column: number = 1;
    #finished: boolean = true;
    #source: string = '';

    reset(): void
    {
        this.#position = 0;
        this.#line = 1;
        this.#column = 1;
        this.#finished = this.#position >= this.#source.length;
    }

    read(source: string): void
    {
        this.#source = source;
        this.reset();
    }

    get position(): number
    {
        return this.#position;
    }

    get line(): number
    {
        return this.#line;
    }

    get column(): number
    {
        return this.#column;
    }

    get finished(): boolean
    {
        return this.#finished;
    }

    get source(): string
    {
        return this.#source;
    }

    step(): void
    {
        if (this.#position + 1 >= this.#source.length) {
            this.#finished = true;
            return;
        }

		this.#position++;

		const character = this.#source[this.#position];

		if (character == '\n') {
			this.#column = 1;
			this.#line++;
		} else {
			this.#column++;
		}
	}

    isSpace(): boolean
    {
        const spaces = ['\n', '\r', ' ', '\t'];
        const character = this.readCharacter();

        return spaces.includes(character);
    }

    skipSpaces(): void
    {
        while (true) {
            if (! this.isSpace())
                break;

            this.step();
        }
    }

    skipCharacters(count: number = 0): void
    {
        for (let i: number = 0; i < count; i++)
            this.step();
    }

    head(): string
    {
        return this.#source.slice(this.#position);
    }

    readCharacter(): string
    {
        return this.#source[this.#position];
    }

    readCharacters(count: number = 1): string
    {
        return this.#source.substring(this.#position, this.#position + count);
    }

    readSlice(start: number, end: number): string
    {
        return this.#source.slice(start, end);
    }

    isReading(reference: string): boolean
    {
        return this.readCharacters(reference.length) === reference;
    }
}