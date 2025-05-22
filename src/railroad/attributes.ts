export class Attribute
{
    #name: string;
    #value: string;

    constructor(
        name: string,
        value: string,
    ) {
        if (! Attribute.isValidName(name))
            throw new SyntaxError(`Invalid attribute name ${name}`);

        this.#name = name;
        this.#value = value;
    }

    static isValidName(attributeName: string): boolean
    {
        const pattern = /^[a-zA-Z][a-zA-Z0-9\-._]*$/;

        return pattern.test(attributeName);
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
    #attributes: { [key: string]: Attribute } = {};

    add(name: string, value: string): void
    {
        const attribute = new Attribute(name, value);
        this.#attributes[name] = attribute;
    }

    get(name: string): string | undefined
    {
        if (! (name in this.#attributes))
            return undefined;

        return this.#attributes[name].value;
    }

    concat(name: string, value: string): void
    {
        const current = this.get(name) ?? '';
        const attribute = new Attribute(name, current + value);

        this.#attributes[name] = attribute;
    }

    toString(): string
    {
        let strings: string[] = [];

        for(const [key, attribute] of Object.entries(this.#attributes)) {
            strings.push(attribute.toString());
        }

        return strings.join(' ');
    }

    toDictionary(): { [key: string]: string }
    {
        const dictionary: { [key: string]: string } = {};

        for(const [key, attribute] of Object.entries(this.#attributes)) {
            dictionary[attribute.name] = attribute.value;
        }

        return dictionary;
    }
}