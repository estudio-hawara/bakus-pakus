import { Attributes } from "./attributes";
import { Options } from "./options";
import { SVG } from "./svg";

type Children = FakeSVG[] | string;

export class FakeSVG
{
    #tag: string;
    #attributes: Attributes;
    #children: Children;
    #document: Document | null;
    #options: Options;

    constructor(
        tag: string,
        attributes: Attributes = new Attributes,
        text: string = '',
        document: Document | null = null,
        options: Options = new Options,
    ) {
        this.#tag = tag;
        this.#attributes = attributes;
        this.#children = text;
        this.#document = document;
        this.#options = options;
    }

    get attributes(): Attributes
    {
        return this.#attributes;
    }

    get children(): Children
    {
        if (typeof this.#children === 'string')
            return this.#children;

        return [...this.#children];
    }

    get options(): Options
    {
        return this.#options;
    }

    format() {}

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
            string += escape(this.#children);
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
