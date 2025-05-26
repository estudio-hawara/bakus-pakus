import { DiagramContainer } from "./diagram_container";
import { FakeSVG } from "./fake_svg";
import { Options } from "./options";
import { path } from "./tags";
import { determineGaps } from "./utils";

export class AlternatingSequence extends DiagramContainer
{
    constructor(items: FakeSVG[], options: Options = new Options)
    {
        if (items.length !== 2)
            throw new RangeError('An alternating sequence must have two children');

        super('g', {}, items, options);

        this.needsSpace = false;

        const first = this.items[0];
        const second = this.items[1];

        const arcX = 2 * this.options.arcRadius / Math.sqrt(2);
        const arcY = 2 * this.options.arcRadius * (1 - 1 / Math.sqrt(2));
        const crossY = Math.max(this.options.arcRadius, this.options.verticalSeparation);
        const crossX = (crossY - arcY) + arcX;

        const firstOut = Math.max(
            2 * this.options.arcRadius + crossY/2,
            this.options.verticalSeparation + first.down + crossY/2,
        );
        const secondIn = Math.max(
            2 * this.options.arcRadius + crossY/2,
            this.options.verticalSeparation + second.up + crossY/2,
        );

        this.up = firstOut + first.height + first.up;
        this.down = secondIn + second.height + second.down;

        const firstWidth = first.width + 2 * (first.needsSpace ? 10 : 0);
        const secondWidth = second.width + 2 * (second.needsSpace ? 10 : 0);

        this.width = 4 * this.options.arcRadius + Math.max(firstWidth + crossX, secondWidth);

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.down}`);
            this.attributes.add('data-type', 'alternating-sequence');
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
            .right(gaps.left)
            .addTo(this);
        
        x += gaps.left;

        path(x + this.width, y)
            .right(gaps.right)
            .addTo(this);
        
        const first = this.items[0];
        const second = this.items[1];

        const firstIn = this.up - first.up;
        const firstOut = this.up - first.up - first.height;

        path(x, y)
            .arc('South', 'East')
            .vUp(firstIn - 2 * this.options.arcRadius)
            .arc('West', 'North')
            .addTo(this);

        first.format(x + 2 * this.options.arcRadius, y + firstIn, this.width - 4 * this.options.arcRadius)
            .addTo(this);
        
        path(x + this.width - 2 * this.options.arcRadius, y - firstOut)
            .arc('North', 'East')
            .vDown(firstOut - 2 * this.options.arcRadius)
            .arc('West', 'South')
            .addTo(this);
        
        const secondIn = this.down - second.down - second.height;
        const secondOut = this.down - second.down;

        path(x, y)
            .arc('North', 'East')
            .vDown(secondIn - 2 * this.options.arcRadius)
            .arc('West', 'South')
            .addTo(this);
        
        second.format(x + 2 * this.options.arcRadius, y + secondIn, this. width - 4 * this.options.arcRadius)
            .addTo(this);
        
        path(x + this.width - 2 * this.options.arcRadius, y + secondOut)
            .arc('South', 'East')
            .vUp(secondOut - 2 * this.options.arcRadius)
            .arc('West', 'North')
            .addTo(this);

        const arcX = 2 * this.options.arcRadius / Math.sqrt(2);
        const arcY = 2 * this.options.arcRadius * (1 - 1 / Math.sqrt(2));
        const crossY = Math.max(this.options.arcRadius, this.options.verticalSeparation);
        const crossX = (crossY - arcY) + arcX;
        const crossBar = (this.width - 4 * this.options.arcRadius - crossX)/2;
        
        path(x + this.options.arcRadius, y - this.options.arcRadius - crossY/2)
            .arc('West', 'South')
            .right(crossBar)
            .semiArc('North', 'Clockwise')
            .l(crossX - arcX, crossY - arcY)
            .semiArc('South West', 'Counter clockwise')
            .right(crossBar)
            .arc('North', 'East')
            .addTo(this);
        
        path(x + this.options.arcRadius, y + this.options.arcRadius + crossY/2)
            .arc('West', 'North')
            .right(crossBar)
            .semiArc('South', 'Counter clockwise')
            .l(crossX - arcX, arcY - crossY)
            .semiArc('North West', 'Clockwise')
            .right(crossBar)
            .arc('South', 'East')
            .addTo(this);
        
        return this;
    }
}