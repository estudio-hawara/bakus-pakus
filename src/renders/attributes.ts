export function isValidAttributeName(attributeName: string): boolean
{
    const pattern = /^[a-zA-Z][a-zA-Z0-9\-._]*$/;

    return pattern.test(attributeName);
}

export class Attribute
{
    #name: string;
    #value: string;

    constructor(
        name: string,
        value: string,
    ) {
        if (! isValidAttributeName(name))
            throw new SyntaxError(`Invalid attribute name ${name}`);

        this.#name = name;
        this.#value = value;
    }

    get name(): string
    {
        return this.#name;
    }

    get value(): string
    {
        return this.#value;
    }

    get escaped(): string
    {
        return this.#value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    }

    toString(): string
    {
        return this.#name + '="' + this.escaped + '"';
    }
}

export class Attributes
{
    #attributes: Attribute[] = [];

    add(name: string, value: string): void
    {
        const attribute = new Attribute(name, value);
        this.#attributes.push(attribute);
    }

    toString(): string
    {
        let string = '';

        for(const [key, attribute] of this.#attributes.entries()) {
            string += ' ' + attribute.toString();
        }

        return string;
    }
}