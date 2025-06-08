import { DiagramContainer } from "@app/railroad/diagram_container";
import { FakeSVG } from "@app/railroad/fake_svg";
import { Options } from "@app/railroad/options";
import { g, path, text, title } from "@app/railroad/tags";
import { determineGaps } from "@app/railroad/utils";

type MultipleChoiceType = 'any' | 'all';

export class MultipleChoice extends DiagramContainer
{
    #type: MultipleChoiceType;
    #normal: number;
    #innerWidth: number;

    constructor(items: FakeSVG[], normal: number = 0, type: MultipleChoiceType = 'any', options: Options = new Options)
    {
        super('g', {class: 'multiple-choice'}, items, options);

        if (normal !== Math.floor(normal))
            throw new TypeError('The normal of an choice constructor must be an integer');
        
        if (normal < 0 || normal > items.length - 1)
            throw new RangeError('The normal of an choice must be the index of one of its items');

        if (type !== 'any' && type !== 'all')
            throw new TypeError('Type type of a multiple choice must be either any or all');

        this.#type = type;
        this.#normal = normal;
        this.#innerWidth = Math.max(...this.items.map(e => e.width));

        this.needsSpace = true;
        this.width = 50 + 2 * this.options.arcRadius + this.#innerWidth;
        this.up = this.items[0].up;
        this.down = this.items[this.items.length - 1].down;
        this.height = this.items[this.#normal].height;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];

            let minimum = this.options.arcRadius + (i == this.#normal - 1 || i == this.#normal + 1 ? 10 : 0);

            if (i < this.#normal)
                this.up += Math.max(minimum, item.height + item.down + this.options.verticalSeparation + this.items[i + 1].up);
            else if (i > this.#normal)
                this.down += Math.max(minimum, item.up + this.options.verticalSeparation + this.items[i - 1].down + this.items[i - 1].height);
        }

        this.down -= this.items[this.#normal].height;

        if (this.options.debug) {
            this.attributes.add('data-updown', `${this.up} ${this.height} ${this.down}`);
            this.attributes.add('data-type', 'multiple-choice');
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

        let distanceFromY = 0;
        const normalItem = this.items[this.#normal];

        for (let i = this.#normal - 1; i >= 0; i--) {
            const item = this.items[i];

            if (i == this.#normal - 1)
                distanceFromY = Math.max(10 + this.options.arcRadius, normalItem.up + this.options.verticalSeparation + item.down + item.height);
        
            path(x + 30, y)
                .vUp(distanceFromY - this.options.arcRadius)
                .arc('West', 'North')
                .addTo(this);
            
            item.format(x + 30 + this.options.arcRadius, y - distanceFromY, this.#innerWidth)
                .addTo(this);
            
            path(x + 30 + this.options.arcRadius + this.#innerWidth, y - distanceFromY + item.height)
                .arc('North', 'East')
                .vDown(distanceFromY - item.height + this.height - this.options.arcRadius - 10)
                .addTo(this);
            
            if (i !== 0)
                distanceFromY += Math.max(this.options.arcRadius, item.up + this.options.verticalSeparation + this.items[i - 1].down + this.items[i - 1].height);
        }

        path(x + 30, y)
            .right(this.options.arcRadius)
            .addTo(this);

        normalItem.format(x + 30 + this.options.arcRadius, y, this.#innerWidth)
            .addTo(this);
        
        path(x + 30 + this.options.arcRadius + this.#innerWidth, y + this.height)
            .right(this.options.arcRadius)
            .addTo(this);
        
        for (let i = this.#normal + 1; i < this.items.length; i++) {
            const item = this.items[i];

            if (i == this.#normal + 1)
                distanceFromY = Math.max(10 + this.options.arcRadius, normalItem.height + normalItem.down + this.options.verticalSeparation + item.up);
            
            path(x + 30, y)
                .vDown(distanceFromY - this.options.arcRadius)
                .arc('West', 'South')
                .addTo(this);
            
            item.format(x + 30 + this.options.arcRadius, y + distanceFromY, this.#innerWidth)
                .addTo(this);
            
            path(x + 30 + this.options.arcRadius + this.#innerWidth, y + distanceFromY + item.height)
                .arc('South', 'East')
                .vUp(distanceFromY - this.options.arcRadius + item.height - normalItem.height)
                .addTo(this);
            
            if (i !== this.items.length - 1)
                    distanceFromY += Math.max(this.options.arcRadius, item.height + item.down + this.options.verticalSeparation + this.items[i + 1].up);
        }
        
        const textGroup = g({class: 'diagram-text'})
            .addTo(this);
        
        title(this.#type === 'any' ? 'take one or more branches, once each, in any order' : 'take all branches, once each, in any order')
            .addTo(textGroup!);

        const textPath1 = path(x + 30, y - 10, {class: 'diagram-text'});
        textPath1.attributes.concat('d', ' h -26 a 4 4 0 0 0 -4 4 v 12 a 4 4 0 0 0 4 4 h 26 z');
        textPath1.addTo(textGroup!);

        text(this.#type === 'any' ? '1+' : 'all', {
            x: x + 15,
            y: y + 4,
            class: 'diagram-text',
        }).addTo(textGroup!);

        const textPath2 = path(x + this.width - 20, y - 10, {class: 'diagram-text'});
        textPath2.attributes.concat('d', ' h 16 a 4 4 0 0 1 4 4 v 12 a 4 4 0 0 1 -4 4 h -16 z');
        textPath2.addTo(textGroup!);

        const textPath3 = path(x + this.width - 13, y - 2, {style: 'stroke-width: 1.75'});
        textPath3.attributes.concat('d', ' a 4 4 0 1 0 6 -1 m 2.75 -1 h -4 v 4 m 0 -3 h 2');
        textPath3.addTo(textGroup!);

        return this;
    }
}