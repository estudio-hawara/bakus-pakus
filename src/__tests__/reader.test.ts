import { Reader } from '../reader';

describe('Reader', () => {

    test('is a class', () => {
        expect(typeof Reader).toBe('function');
    });

    test('starts at position zero, in the first line and column', () => {
        const reader = new Reader;
        reader.read('');

        expect(reader.position).toBe(0);
        expect(reader.line).toBe(1);
        expect(reader.column).toBe(1);
        expect(reader.finished).toBe(false);
    });

    test('steps around a string', () => {
        const reader = new Reader;
        reader.read('22\n1');

        expect(reader.position).toBe(0);
        expect(reader.line).toBe(1);
        expect(reader.column).toBe(1);
        expect(reader.finished).toBe(false);

        reader.step();
        expect(reader.position).toBe(1);
        expect(reader.line).toBe(1);
        expect(reader.column).toBe(2);
        expect(reader.finished).toBe(false);

        reader.step();
        expect(reader.position).toBe(2);
        expect(reader.line).toBe(2);
        expect(reader.column).toBe(1);
        expect(reader.finished).toBe(false);

        reader.step();
        expect(reader.position).toBe(3);
        expect(reader.line).toBe(2);
        expect(reader.column).toBe(2);
        expect(reader.finished).toBe(false);

        reader.step();
        expect(reader.position).toBe(3);
        expect(reader.line).toBe(2);
        expect(reader.column).toBe(2);
        expect(reader.finished).toBe(true);
    });

    test('can be reseted', () => {
        const reader = new Reader;
        reader.read('22\n1');

        expect(reader.position).toBe(0);
        expect(reader.line).toBe(1);
        expect(reader.column).toBe(1);
        expect(reader.finished).toBe(false);

        reader.step();
        expect(reader.position).toBe(1);
        expect(reader.line).toBe(1);
        expect(reader.column).toBe(2);
        expect(reader.finished).toBe(false);

        reader.reset();
        expect(reader.position).toBe(0);
        expect(reader.line).toBe(1);
        expect(reader.column).toBe(1);
        expect(reader.finished).toBe(false);
    });

    test('it\'s source can be accessed', () => {
        const reader = new Reader;
        const source = '2 \n\t 1';
        reader.read(source);

        expect(reader.source).toBe(source);
    });

    test('skips spaces', () => {
        const reader = new Reader;
        reader.read('2 \n\t 1');

        expect(reader.readCharacter()).toBe('2');

        reader.step();
        reader.skipSpaces();
        expect(reader.readCharacter()).toBe('1');
    });

    test('skips characters', () => {
        const reader = new Reader;
        reader.read('987654321');

        expect(reader.readCharacter()).toBe('9');

        reader.skipCharacters(3);
        expect(reader.readCharacter()).toBe('6');

        reader.skipCharacters(0);
        expect(reader.readCharacter()).toBe('6');

        reader.skipCharacters();
        expect(reader.readCharacter()).toBe('6');
    });

    test('returns the source from its current position', () => {
        const reader = new Reader;
        reader.read('3210');
        reader.skipCharacters(2);

        expect(reader.head()).toBe('10');
    });

    test('reads the current character', () => {
        const reader = new Reader;
        reader.read('321\n0');

        expect(reader.readCharacter()).toBe('3');

        reader.step();
        expect(reader.readCharacter()).toBe('2');

        reader.step();
        expect(reader.readCharacter()).toBe('1');

        reader.step();
        expect(reader.readCharacter()).toBe('\n');

        reader.step();
        expect(reader.readCharacter()).toBe('0');
    });

    test('reads a given number of characters', () => {
        const reader = new Reader;
        reader.read('321\n0');

        expect(reader.readCharacters()).toBe('3');
        expect(reader.readCharacters(3)).toBe('321');

        reader.step();
        expect(reader.readCharacters(3)).toBe('21\n');
        expect(reader.readCharacters(9)).toBe('21\n0');
    });

    test('reads a slice of the source', () => {
        const reader = new Reader;
        reader.read('3210');

        expect(reader.readSlice(1, 3)).toBe('21');
    });

    test('can check if it\'s currently reading a value', () => {
        const reader = new Reader;
        reader.read('321');

        expect(reader.isReading('4')).toBeFalsy();
        expect(reader.isReading('3')).toBeTruthy();
        expect(reader.isReading('32')).toBeTruthy();

        reader.step();
        expect(reader.isReading('32')).toBeFalsy();
        expect(reader.isReading('21')).toBeTruthy();
    });

});