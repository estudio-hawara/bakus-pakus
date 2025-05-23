import { Rule, Specification } from '../specification';

describe('Rule', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Rule).toBe('function');
        });

    });

    describe('Getter: pattern', () => {

        it('its pattern can be accessed', () => {
            const pattern = /^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/;
            const type = 'identifier';
            const rule = new Rule(pattern, type);

            expect(rule.pattern).toBe(pattern);
        });

    });

    describe('Getter: type', () => {

        it('its type can be accessed', () => {
            const pattern = /^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/;
            const type = 'identifier';
            const rule = new Rule(pattern, type);

            expect(rule.type).toBe(type);
        });

    });

    describe('Method: match', () => {

        it('can check if a string matches the pattern', () => {
            const pattern = /^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/;
            const type = 'identifier';
            const rule = new Rule(pattern, type);

            expect(rule.match('1abc')).toBeFalsy();
            expect(rule.match("abc1")).toBeTruthy();
        });

    });

});

describe('Specification', () => {

    describe('Constructor', () => {

        it('is a class', () => {
            expect(typeof Specification).toBe('function');
        });

    });

    describe('Getter: rules', () => {

        it('its rules list can be accessed', () => {
            const specification = new Specification;

            expect(specification.rules).toHaveLength(0);
        });

    });

    describe('Method: add', () => {

        it('has a method to register new rules', () => {
            const specification = new Specification;

            const pattern = /^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/;
            const type = 'identifier';

            specification.add(pattern, type);

            const rules = specification.rules;

            expect(rules).toHaveLength(1);
            expect(rules[0].pattern).toBe(pattern);
            expect(rules[0].type).toBe(type);
        });

    });

});