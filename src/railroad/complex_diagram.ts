import { Diagram } from "./diagram";
import { End } from "./end";
import { FakeSVG } from "./fake_svg";
import { Options } from "./options";
import { Start } from "./start";

export class ComplexDiagram extends Diagram
{
    constructor(items: FakeSVG[], options: Options = new Options)
    {
        if (! (items[0] instanceof Start))
            items.unshift(new Start('complex'));
        else if ((items[0] as Start).type !== 'complex')
            items[0] = new Start('complex');

        if (! (items[items.length - 1] instanceof End))
            items.push(new End('complex'));
        else if ((items[items.length - 1] as End).type !== 'complex')
            items[items.length - 1] = new End('complex');

        super(items, options);
    }
}