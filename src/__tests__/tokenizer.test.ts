import { Token, Tokenizer } from '@app/tokenizer';

describe('Token', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Token).toBe('function');
        });

    });

    describe('Getter: type', () => {

        it('token type and its value', () => {
            const type = 'identifier';
            const value = 'Left hand side';
            const token = new Token(type, value);

            expect(token.type).toBe(type);
        });

    });

    describe('Getter: value', () => {

        it('token type and its value', () => {
            const type = 'identifier';
            const value = 'Left hand side';
            const token = new Token(type, value);

            expect(token.value).toBe(value);
        });

    });

});

describe('Tokenizer', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Tokenizer).toBe('function');
        });

    });

    describe('Getter: position', () => {

        it('its current position can be accessed', () => {
            const tokenizer = new Tokenizer;

            expect(tokenizer.position).toBe(0);
        });

    });

    describe('Getter: line', () => {

        it('its current line can be accessed', () => {
            const tokenizer = new Tokenizer;

            expect(tokenizer.line).toBe(1);
        });

    });

    describe('Getter: column', () => {

        it('its current column can be accessed', () => {
            const tokenizer = new Tokenizer;

            expect(tokenizer.column).toBe(1);
        });

    });

    describe('Getter: finished', () => {

        it('its finished flag can be accessed', () => {
            const tokenizer = new Tokenizer;

            expect(tokenizer.finished).toBeTruthy();
        });

    });

    describe('Getter: source', () => {

        it('its source text can be accessed', () => {
            const tokenizer = new Tokenizer;

            expect(tokenizer.source).toBe('');
        });

    });

    describe('Method: read', () => {

        it('can read text', () => {
            const tokenizer = new Tokenizer;
            const source = 'binary = "0" | "1";';
            tokenizer.read(source);

            expect(tokenizer.source).toBe(source);
        });

    });

    describe('Method: reset', () => {

        it('can be reset', () => {
            const tokenizer = new Tokenizer;
            const source = 'binary = "0" | "1";';
            tokenizer.read(source);
            tokenizer.reset();

            expect(tokenizer.position).toBe(0);
            expect(tokenizer.line).toBe(1);
            expect(tokenizer.column).toBe(1);
        });

    });

    describe('Method: getNextToken', () => {

        it('returns null when it reaches its end', () => {
            const tokenizer = new Tokenizer;
            tokenizer.read('');

            expect(tokenizer.getNextToken()).toBeNull();
        });

        it('process ebnf tokens', () => {
            const tokenizer = new Tokenizer;
            const source = 'binary = "0" | "1";';
            tokenizer.read(source);
            const token = tokenizer.getNextToken();

            expect(token?.type).toBe('identifier');
            expect(token?.value).toBe('binary');
        });

        it('throws an exception when an unexpected token is found', () => {
            const tokenizer = new Tokenizer;
            const source = '!!!';
            tokenizer.read(source);

            expect(() => { tokenizer.getNextToken(); }).toThrow(SyntaxError);
        });

        it('skips ignorable tokens (like whitespaces)', () => {
            const tokenizer = new Tokenizer;
            const source = '\n binary = "0" | "1";';
            tokenizer.read(source);
            const token = tokenizer.getNextToken();

            expect(token?.type).toBe('identifier');
            expect(token?.value).toBe('binary');
        });

    });

});