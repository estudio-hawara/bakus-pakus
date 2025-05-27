import { DiagramContainer } from "./diagram_container";
import { FakeSVG } from "./fake_svg";
import { Options } from "./options";
import { path } from "./tags";
import { determineGaps } from "./utils";

export class Choice extends DiagramContainer
{
    #normal: number;

    constructor(items: FakeSVG[], options: Options = new Options, normal: number)
    {
        if (normal !== Math.floor(normal))
            throw new TypeError('The normal of an choice constructor must be an integer');
        
        if (normal < 0 || normal >= items.length - 1)
            throw new RangeError('The normal of an choice must be the index of one of its items');

        super('g', {}, items, options);

        this.#normal = normal;

        const first = 0;
        const last = this.items.length - 1;

        this.width = Math.max(...this.items.map(e => e.width)) + this.options.arcRadius * 4;
        this.height = this.items[normal].height;

        let arcs = 0;

        this.up = this.items[first].up;

        for (let i = first; i < normal; i++) {
            arcs = (i == normal - 1) ? 2 * this.options.arcRadius : this.options.arcRadius;

            this.up += Math.max(arcs, this.items[i].height + this.items[i].down + this.options.verticalSeparation + this.items[i + 1].up);
        }

        this.down = this.items[last].down;

        for (let i = normal + 1; i <= last; i++) {
            arcs = (i == normal + 1) ? 2 * this.options.arcRadius : this.options.arcRadius;

            this.down += Math.max(arcs, this.items[i - 1].height + this.items[i - 1].down + this.options.verticalSeparation + this.items[i].up);
        }

        this.down -= this.items[normal].height;

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.height} ${this.down}`);
            this.attributes.add('data-type', 'choice');
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

        const last = this.items.length - 1;
        const innerWidth = this.width - this.options.arcRadius * 4;
        
        let distanceFromY = 0;
        for (let i = this.#normal - 1; i >= 0; i--) {
            let item = this.items[i];

            if (i == this.#normal - 1)
                Math.max(this.options.arcRadius * 2, this.items[this.#normal].up + this.options.verticalSeparation + item.down + item.height);

            path(x, y)
                .arc('South', 'East')
                .vUp(distanceFromY - this.options.arcRadius * 2)
                .arc('West', 'North')
                .addTo(this);
            
            item.format(x + this.options.arcRadius * 2, y - distanceFromY, innerWidth)
                .addTo(this);
            
            path(x + this.options.arcRadius * 2 + innerWidth, y - distanceFromY + item.height)
                .arc('North', 'East')
                .vDown(distanceFromY - item.height + this.height - this.options.arcRadius * 2)
                .arc('West', 'South')
                .addTo(this);
            
            distanceFromY += Math.max(this.options.arcRadius, item.up + this.options.verticalSeparation + ((i === 0) ? 0 : this.items[i - 1].down + this.items[i - 1].height));
        }
    
        path(x, y)
            .right(this.options.arcRadius * 2)
            .addTo(this);
        
        this.items[this.#normal]
            .format(x + this.options.arcRadius * 2, y, innerWidth)
            .addTo(this);
        
        path(x + this.options.arcRadius * 2 + innerWidth, y + this.height)
            .right(this.options.arcRadius * 2)
            .addTo(this);
        
        for (let i = this.#normal + 1; i <= last; i++) {
            const item = this.items[i];

            if (i == this.#normal + 1)
                distanceFromY = Math.max(this.options.arcRadius * 2, this.height + this.items[this.#normal].down + this.options.verticalSeparation + item.up);

            path(x, y)
                .arc('North', 'East')
                .vDown(distanceFromY - this.options.arcRadius * 2)
                .arc('West', 'South')
                .addTo(this);
            
			item.format(x + this.options.arcRadius * 2, y + distanceFromY, innerWidth)
                .addTo(this);
            
			path(x + this.options.arcRadius * 2 + innerWidth, y + distanceFromY + item.height)
				.arc('South', 'East')
				.vUp(distanceFromY - this.options.arcRadius * 2 + item.height - this.height)
				.arc('West', 'North')
                .addTo(this);
            
			distanceFromY += Math.max(this.options.arcRadius, item.height + item.down + this.options.verticalSeparation + (i == last ? 0 : this.items[i + 1].up));
        }
        
        return this;
    }
}