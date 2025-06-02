import { FakeSVG } from "@app/railroad/fake_svg";
import { Options } from "@app/railroad/options";
import { a, path, text, title } from "@app/railroad/tags";
import { determineGaps } from "@app/railroad/utils";

export class Comment extends FakeSVG
{
    #text: string;
    #href: string|null = null;
    #title: string|null = null;

    constructor(
        text: string,
        href: string|null = null,
        title: string|null = null,
        options: Options = new Options,
    ) {
        super('g', {}, undefined, undefined, options);

        this.#text = text;
        this.#href = href;
        this.#title = title;

        this.needsSpace = true;
        this.up = 8;
        this.down = 8;
        this.width = this.#text.length * this.options.defaultCharWidth + 10;

        if(this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.down}`);
            this.attributes.add('data-type', 'comment');
        }
    }

    format(
        x: number = 0,
        y: number = 0,
        width: number = 0
    ): FakeSVG
    {
        const gaps = determineGaps(width, this.width);

        path(x, y)
            .h(gaps.left)
            .addTo(this);
        
        path(x + gaps.left + this.width, y + this.height)
            .h(gaps.right)
            .addTo(this);
        
        x += gaps.left;
        
        const comment = text(this.#text, {
            x: x + this.width / 2,
            y: y + 5,
            class: 'comment',
        });

        if (this.#href)
            a({'xlink:href': this.#href}, [comment])
                .addTo(this);
        else
            comment.addTo(this);

        if (this.#title)
            title(this.#title, {}).addTo(this);
    
        return this;
    }
}