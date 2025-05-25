import { Options } from "./options";

type gapTypes = {
    left: number,
    right: number,
}

export function unnull(...args: any) {
	return args.reduce((sofar: any, x: any) => sofar !== undefined ? sofar : x);
}

export function escapeString(value: string): string
{
    return value.replace(
        /[*_`[\]<>&]/g,
        (char: string) => '&#' + char.charCodeAt(0) + ';'
    );
}

export function determineGaps(outer: number, inner: number, options: Options = new Options): gapTypes
{
    var diff = outer - inner;

    switch(options.internalAlignment) {
        case 'left': return { left: 0, right: diff };
        case 'right': return { left: diff, right: 0 };
        default: return { left: diff / 2, right: diff / 2 };
    }
}