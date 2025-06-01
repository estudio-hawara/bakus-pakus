import { FakeSVG } from "@app/railroad/fake_svg";
import { Skip } from "@app/railroad/skip";
import { path } from "@app/railroad/tags";
import { determineGaps } from "@app/railroad/utils";

export class OneOrMore extends FakeSVG
{
    #item: FakeSVG;
    #separator: FakeSVG;

    constructor(item: FakeSVG, separator: FakeSVG = new Skip)
    {
        super('g');

        this.#item = item;
        this.#separator = separator;

        this.width = Math.max(this.#item.width, this.#separator.width) + 2 * this.options.arcRadius;
        this.height = this.#item.height;
        this.up = this.#item.up;
        this.down = Math.max(2 * this.options.arcRadius, this.#item.down + this.options.verticalSeparation + this.#separator.up + this.#separator.height + this.#separator.down);
        this.needsSpace = true;

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.height} ${this.down}`);
            this.attributes.add('data-type', 'one-or-more');
        }
    }

    format(
        x: number = 0,
        y: number = 0,
        width: number = 0,
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
        
        path(x, y)
            .right(this.options.arcRadius)
            .addTo(this);

        this.#item.format(x + this.options.arcRadius, y, this.width - 2 * this.options.arcRadius)
            .addTo(this);
        
        path(x + this.width - this.options.arcRadius, y + this.height)
            .right(this.options.arcRadius)
            .addTo(this);
        
        const distanceFromY = Math.max(2* this.options.arcRadius, this.#item.height + this.#item.down + this.options.verticalSeparation + this.#separator.up);

        path(x + this.options.arcRadius, y)
            .arc('North', 'West')
            .vDown(distanceFromY - 2 * this.options.arcRadius)
            .arc('West', 'South')
            .addTo(this);
        
        this.#separator.format(x + this.options.arcRadius, y + distanceFromY, this.width - 2 * this.options.arcRadius)
            .addTo(this);
        
        path(x + this.width - this.options.arcRadius, y + distanceFromY + this.#separator.height)
            .arc('South', 'East')
            .vUp(distanceFromY - 2 * this.options.arcRadius + this.#separator.height - this.#item.height)
            .arc('East', 'North')
            .addTo(this);
        
        return this;
    }

    walk(callback: Function)
    {
        callback(this);
        this.#item.walk(callback)
        this.#separator.walk(callback);
    }
}