import { Attributes } from "./attributes";
import { FakeSVG } from "./fake_svg";
import { Options } from "./options";
import { a, path, rect, text, title } from "./tags";
import { determineGaps } from "./utils";

export class Terminal extends FakeSVG
{
    #text: string;

    constructor(
        text: string,
        attributes: Attributes | { [key: string]: string | number | boolean } = new Attributes,
        options: Options = new Options,
    ) {
        super('g', attributes, '', document, options);

        this.#text = text;

        this.up = this.down = 11;
        this.width = this.#text.length * this.options.defaultCharWidth + 20;
       
        this.attributes.add('class', 'terminal');

        if (this.options.debug) {
            this.attributes.add('data-updown', this.up + " " + this.down);
            this.attributes.add('data-type', 'terminal');
        }
    }

    get text(): string
    {
        return this.#text;
    }

    format(x: number, y: number, width: number): Terminal
    {
        const gaps = determineGaps(width, this.width, this.options);

        path(x, y)
            .h(gaps.left)
            .addTo(this);

        path(x + gaps.left + this.width, y)
            .h(gaps.right)
            .addTo(this);

        x += gaps.left;

        rect({
            x: x,
            y: y - 11,
            width: this.width,
            height: this.up + this.down,
            rx: 10,
            ry: 10,
        }).addTo(this);

        let content = text(this.#text, {
            x: x + this.width / 2,
            y: y + 4,
        });

        if (this.attributes.get('href'))
            a({ 'xlink:href': this.attributes.get('href')! }, [content]).addTo(this);
        else
            content.addTo(this);

        if (this.attributes.get('title'))
            title(this.attributes.get('title')!).addTo(this);

        return this;
    }
}

export function wrapString(value: FakeSVG | string): FakeSVG | Terminal
{
    return value instanceof FakeSVG ? value : new Terminal(value);
}