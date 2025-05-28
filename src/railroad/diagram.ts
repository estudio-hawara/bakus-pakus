import { Attributes } from "@railroad/attributes";
import { DiagramContainer } from "@railroad/diagram_container";
import { End } from "@railroad/end";
import { FakeSVG } from "@railroad/fake_svg";
import { Options } from "@railroad/options";
import { Path } from "@railroad/path";
import { Start } from "@railroad/start";
import { defaultStyle } from "@railroad/style";
import { unnull } from "@railroad/utils";

export type PaddingType = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export class Diagram extends DiagramContainer
{
    #formatted: boolean = false;

    constructor(items: FakeSVG[], options: Options = new Options)
    {
        super('svg', {class: options.diagramClass}, items, options);

        if (! (this.items[0] instanceof Start))
            this.items.unshift(new Start);

        if (! (this.items[this.items.length - 1] instanceof End))
            this.items.push(new End);

        for (const item of this.items) {
            this.width += item.width + (item.needsSpace ? 20 : 0);
            this.height += item.height;

            this.up = Math.max(this.up, item.up - this.height);
            this.down = Math.max(this.down - this.height, item.down);
        }
    }

    format(
        x: number = 0,
        y: number = 0,
        width: number = 0,
        padding: PaddingType = { top: undefined, right: undefined, bottom: undefined, left: undefined },
    ): FakeSVG
    {
        if (width)
            throw new Error('Setting the width directly on a diagram has no effect');

        if (this.#formatted)
            return this;

        padding.top = unnull(padding.top, 20);
        padding.right = unnull(padding.right, padding.top, 20);
        padding.bottom = unnull(padding.bottom, padding.top, 20);
        padding.left = unnull(padding.left, padding.top, 20);

        x += padding.left!;
        y += padding.top! + this.up;

        const attributes = new Attributes;
        if (this.options.strokeOddPixelLength)
            attributes.add('transform', 'translate(.5 .5)');

        let g = new FakeSVG('g', attributes);

        for (const item of this.items) {
            if (item.needsSpace) {
                new Path(x, y).h(10).addTo(g);
                x += 10;
            }

            item.format(x, y, item.width).addTo(g);

            x += item.width;
            y += item.height;

            if (item.needsSpace) {
                new Path(x, y).h(10).addTo(g);
                x += 10;
            }
        }

        this.attributes.add('width', (this.width + padding.left! + padding.right!).toString());
        this.attributes.add('height', (this.up + this.height + this.down + padding.top! + padding.bottom!).toString());
        this.attributes.add('viewBox', `0 0 ${this.attributes.get('width')} ${this.attributes.get('height')}`);

        g.addTo(this);
        this.#formatted = true;

        return this;
    }

    /* istanbul ignore next */
    toSVG(document: Document | null = null)
    {
        this.format();

        return super.toSVG.call(this, document);
    }

    toString()
    {
        this.format();

        return super.toString.call(this);
    }

    toStandalone(style: string = '')
    {
        this.format();

        const script = new FakeSVG('style', {}, style || defaultStyle);

        const children = this.children;

        if (! Array.isArray(children))
            throw new Error('Can\'t call standalone on an element with children of type string');

        children.push(script);
        this.attributes.add('xmlns', 'http://www.w3.org/2000/svg');
        this.attributes.add('xmlns:xlink', 'http://www.w3.org/1999/xlink');

        const result = super.toString.call(this);

        children.pop();
        this.attributes.delete('xmlns');
        this.attributes.delete('xmlns:xlink');

        return result;
    }
}