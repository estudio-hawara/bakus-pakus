import { Reader } from '@app/reader';

describe('Reader', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Reader).toBe('function');
        });

    });

    describe('Getter: position', () => {

        it('its current position can be accessed', () => {
            const reader = new Reader;
            reader.read('321');

            expect(reader.position).toBe(0);

            reader.step();

            expect(reader.position).toBe(1);
        });

    });

    describe('Getter: line', () => {

        it('its current line can be accessed', () => {
            const reader = new Reader;
            reader.read('2\n1');

            expect(reader.line).toBe(1);

            reader.step();

            expect(reader.line).toBe(2);
        });

    });

    describe('Getter: column', () => {

        it('its current column can be accessed', () => {
            const reader = new Reader;
            reader.read('21');

            expect(reader.column).toBe(1);

            reader.step();

            expect(reader.column).toBe(2);
        });

    });

    describe('Getter: finished', () => {

        it('its finished flag can be accessed', () => {
            const reader = new Reader;
            reader.read('21');

            expect(reader.finished).toBeFalsy();

            reader.step();
            reader.step();
            reader.step();

            expect(reader.finished).toBeTruthy();
        });

    });

    describe('Getter: source', () => {

        it('it\'s source can be accessed', () => {
            const reader = new Reader;
            const source = '321';
            reader.read(source);

            expect(reader.source).toBe(source);
        });

    });

    describe('Method: reset', () => {

        it('can be reset', () => {
            const reader = new Reader;
            reader.read('321');

            reader.step();
            reader.step();
            reader.step();
            reader.reset();

            expect(reader.position).toBe(0);
            expect(reader.line).toBe(1);
            expect(reader.column).toBe(1);
            expect(reader.finished).toBe(false);
        });

    });

    describe('Method: read', () => {

        it('starts at position zero, in the first line and column', () => {
            const reader = new Reader;
            reader.read('321');

            expect(reader.position).toBe(0);
            expect(reader.line).toBe(1);
            expect(reader.column).toBe(1);
            expect(reader.finished).toBe(false);
        });

    });

    describe('Method: step', () => {

        it('steps around a multiline string', () => {
            const reader = new Reader;
            reader.read('2\n1');

            expect(reader.position).toBe(0);
            expect(reader.line).toBe(1);
            expect(reader.column).toBe(1);
            expect(reader.finished).toBe(false);

            reader.step();
            expect(reader.position).toBe(1);
            expect(reader.line).toBe(2);
            expect(reader.column).toBe(1);
            expect(reader.finished).toBe(false);

            reader.step();
            expect(reader.position).toBe(2);
            expect(reader.line).toBe(2);
            expect(reader.column).toBe(2);
            expect(reader.finished).toBe(false);

            reader.step();
            expect(reader.position).toBe(2);
            expect(reader.line).toBe(2);
            expect(reader.column).toBe(2);
            expect(reader.finished).toBe(true);
        });

    });

    describe('Method: isSpace', () => {

        it('can tell if the current character is a space', () => {
            const reader = new Reader;
            reader.read('2 1');

            expect(reader.isSpace()).toBeFalsy();

            reader.step();

            expect(reader.isSpace()).toBeTruthy();

            reader.step();

            expect(reader.isSpace()).toBeFalsy();
        });

    });

    describe('Method: skipSpaces', () => {

        it('skips spaces, tabs and line breaks', () => {
            const reader = new Reader;
            reader.read('2 \n\t 1');

            expect(reader.readCharacter()).toBe('2');

            reader.step();
            reader.skipSpaces();
            expect(reader.readCharacter()).toBe('1');
        });

    });

    describe('Method: skipCharacters', () => {

        it('skips characters', () => {
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

        it('returns the source from its current position', () => {
            const reader = new Reader;
            reader.read('4321');
            reader.skipCharacters(2);

            expect(reader.head()).toBe('21');
        });

    });

    describe('Method: readCharacter', () => {

        it('reads the current character', () => {
            const reader = new Reader;
            reader.read('1\n0');

            expect(reader.readCharacter()).toBe('1');

            reader.step();
            expect(reader.readCharacter()).toBe('\n');

            reader.step();
            expect(reader.readCharacter()).toBe('0');
        });

    });

    describe('Method: readCharacters', () => {

        it('reads a given number of characters', () => {
            const reader = new Reader;
            reader.read('321');

            expect(reader.readCharacters()).toBe('3');
            expect(reader.readCharacters(3)).toBe('321');
        });

    });

    describe('Method: readSlice', () => {

        it('reads a slice of the source', () => {
            const reader = new Reader;
            reader.read('3210');

            expect(reader.readSlice(1, 3)).toBe('21');
        });

    });

    describe('Method: isReading', () => {

        it('can check if it\'s currently reading a value', () => {
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

});