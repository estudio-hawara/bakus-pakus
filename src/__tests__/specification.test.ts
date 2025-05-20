import { Rule, Specification } from '../specification';

describe('Rule', () => {

    test('is a class', () => {
        expect(typeof Rule).toBe('function');
    });

    test('can store a regex and a type', () => {
        const pattern = /^[a-zA-Z]+([a-zA-Z0-9 ]+[a-zA-Z0-9])?/;
        const type = 'identifier';
        const rule = new Rule(pattern, type);

        expect(rule.pattern).toBe(pattern);
        expect(rule.type).toBe(type);
    });

});

describe('Specification', () => {

    test('is a class', () => {
        expect(typeof Specification).toBe('function');
    });

    test('can store rules', () => {
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