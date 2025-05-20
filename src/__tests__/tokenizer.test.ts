import { Token, Tokenizer } from '../tokenizer';

describe('Token', () => {

    test('is a class', () => {
        expect(typeof Token).toBe('function');
    });

    test('token type and its value', () => {
        const type = 'identifier';
        const value = 'Left hand side';
        const token = new Token(type, value);

        expect(token.type).toBe(type);
        expect(token.value).toBe(value);
    });

});

describe('Tokenizer', () => {

    test('is a class', () => {
        expect(typeof Tokenizer).toBe('function');
    });

    test('exposes properties of it\'s reader', () => {
        const tokenizer = new Tokenizer;

        expect(tokenizer.position).toBe(0);
        expect(tokenizer.line).toBe(1);
        expect(tokenizer.column).toBe(1);
    });

    test('can read text', () => {
        const tokenizer = new Tokenizer;
        const source = 'binary = "0" | "1";';
        tokenizer.read(source);

        expect(tokenizer.source).toBe(source);
    });

    test('returns null when it reaches its end', () => {
        const tokenizer = new Tokenizer;
        tokenizer.read('');

        expect(tokenizer.getNextToken()).toBeNull();
    });

    test('process ebnf tokens', () => {
        const tokenizer = new Tokenizer;
        const source = 'binary = "0" | "1";';
        tokenizer.read(source);
        const token = tokenizer.getNextToken();

        expect(token?.type).toBe('identifier');
        expect(token?.value).toBe('binary');
    });

    test('throws an exception when an unexpected token is found', () => {
        const tokenizer = new Tokenizer;
        const source = '!!!';
        tokenizer.read(source);

        expect(() => { tokenizer.getNextToken(); }).toThrow(SyntaxError);
    });

    test('skips ignorable tokens (like whitespaces)', () => {
        const tokenizer = new Tokenizer;
        const source = '\n binary = "0" | "1";';
        tokenizer.read(source);
        const token = tokenizer.getNextToken();

        expect(token?.type).toBe('identifier');
        expect(token?.value).toBe('binary');
    });

});