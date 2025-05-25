import { Attributes } from "./attributes";
import { Options } from "./options";
import { SVG } from "./svg";
import { escapeString } from "./utils";

export type Children = FakeSVG[] | string;

export class FakeSVG
{
    #tag: string;
    #attributes: Attributes;
    #children: Children;
    #document: Document | null;
    #options: Options;

    up: number = 0;
    down: number = 0;
    height: number = 0;
    width: number = 0;
    needsSpace: boolean = false;

    constructor(
        tag: string,
        attributes: Attributes | { [key: string]: string | number | boolean } = new Attributes,
        children: Children = [],
        document: Document | null = null,
        options: Options = new Options,
    ) {
        this.#tag = tag;

        if (! (attributes instanceof Attributes))
            attributes = new Attributes(attributes);

        this.#attributes = attributes;
        this.#children = children;
        this.#document = document;
        this.#options = options;
    }

    get tag(): string
    {
        return this.#tag;
    }

    get attributes(): Attributes
    {
        return this.#attributes;
    }

    get children(): Children
    {
        return this.#children;
    }

    get options(): Options
    {
        return this.#options;
    }

    set children(value: Children)
    {
        this.#children = value;
    }

    /* istanbul ignore next */
    format(x: number = 0, y: number = 0, width: number = 0): FakeSVG
    {
        return this;
    }

    appendChild(element: FakeSVG)
    {
        if (typeof this.#children === 'string')
            this.#children = [];

        this.#children.push(element);
    }

    addTo(parent: FakeSVG | Element)
    {
        if(parent instanceof FakeSVG) {
            parent.appendChild(this);
            return this;
        }
        
        if (parent instanceof Element) {
            var svg = this.toSVG();
            parent.appendChild(svg);
            return svg;
        }
    }

    toSVG(document: Document | null = null) {
        this.#document = document || this.#document;

        if (this.#document === null)
            throw new Error('Missing document object');

        const element = SVG(this.#document, this.#tag, this.#attributes.toDictionary());

        if (typeof this.#children === 'string') {
            element.textContent = this.#children;
        }

        if (Array.isArray(this.#children))
            this.#children.forEach(e => element.appendChild(e.toSVG(this.#document)));

        return element;
    }

    toString(): string
    {
        let string = this.#attributes.count() ?
            `<${this.#tag} ${this.#attributes.toString()}>` :
            `<${this.#tag}>`;

        if(this.#tag == 'g' || this.#tag == 'svg')
            string += "\n";

        if (typeof this.#children == 'string') {
            string += escapeString(this.#children);
        }

        if (Array.isArray(this.#children))
            this.#children.forEach(e => string += e);

        string += '</' + this.#tag + '>\n';

        return string;
    }

    walk(callback: Function)
    {
        callback(this);
    }
}
