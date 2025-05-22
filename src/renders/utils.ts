export function escape(value: string): string
{
    return value.replace(
        /[*_`[\]<>&]/g,
        (char: string) => '&#' + char.charCodeAt(0) + ';'
    );
}