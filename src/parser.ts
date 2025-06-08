import { Factory, Grammar, Group, Identifier, Optional, Repetition, Rhs, Rule, Special, Terminal } from "@app/factory";
import { Token, Tokenizer } from "@app/tokenizer";

export class Parser
{
    #tokenizer: Tokenizer;
    #factory: Factory;
    #lookahead: Token|null = null;

    constructor(
        tokenizer: Tokenizer = new Tokenizer,
        factory: Factory = new Factory,
    ) {
        this.#tokenizer = tokenizer;
        this.#factory = factory;
    }

    read(value: string)
    {
        this.#tokenizer.read(value);
        this.reset();
    }

    parse(value: string): Grammar
    {
        this.read(value);

        return this.Grammar();
    }

    reset()
    {
        this.#tokenizer.reset();
        this.#lookahead = this.#tokenizer.getNextToken();
    }

    eat(type: string)
    {
        const token = this.#lookahead;

        if (token == null)
            throw new SyntaxError(`Unexpected end of input when a ${type} was expected at line: ${this.#tokenizer.line} and column: ${this.#tokenizer.column}.`);

        if (token.type !== type)
            throw new SyntaxError(`Unexpected ${token.type} when a ${type} was expected at line: ${this.#tokenizer.line} and column: ${this.#tokenizer.column}.`);

        this.#lookahead = this.#tokenizer.getNextToken()

        return token;
    }

    /**
     * Grammar
     *   = RuleList
     *   ;
     */
    Grammar(): Grammar
    {
        const rules = this.RuleList();
        return this.#factory.Grammar(rules);
    }

    /**
     * RuleList
     *   = Rule
     *   | RuleList Rule
     *   ;
     */
    RuleList(): Array<Rule>
    {
        const rules: Array<Rule> = [];

        while (this.#lookahead != null) {
            rules.push(this.Rule());
        }

        return rules;
    }

    /**
     * Rule
     *   = Identifier
     *   , "="
     *   , Sequence
     */
    Rule(): Rule
    {
        const identifier = this.Identifier();
        this.eat('=');
        const rhs = this.Sequence();
        this.eat(';');

        return this.#factory.Rule(identifier, rhs);
    }

    /**
     * Identifier
     *   = IDENTIFIER
     *   ;
     */
    Identifier(): Identifier
    {
        const token = this.eat('identifier');
        return this.#factory.Identifier(token.value);
    }

    /**
     * Sequence
     *   = Choice
     *   | Sequence, ",", Choice
     *   ;
     */
    Sequence(): Rhs
    {
        let left = this.Choice();

        while(this.#lookahead!.type === ',') {
            this.eat(',');
            const right = this.Choice();

            left = this.#factory.Sequence(left, right);
        }

        return left;
    }

    /**
     * Choice
     *   = Rhs
     *   | Choice, "|", Rhs
     */
    Choice(): Rhs
    {
        let left = this.Rhs();

        while(this.#lookahead!.type === '|') {
            this.eat('|');
            const right = this.Rhs();

            left = this.#factory.Choice(left, right);
        }

        return left;
    }

    /**
     * Rhs
     *   = Terminal
     *   | Identifier
     *   | Group
     *   | Repetition
     *   | Optional
     *   ;
     */
    Rhs(): Rhs
    {
        switch(this.#lookahead!.type) {
            case '(':
                return this.Group();
            case '{':
                return this.Repetition();
            case '[':
                return this.Optional();
            case 'special':
                return this.Special();
            case 'identifier':
                return this.Identifier();
            case 'terminal':
                return this.Terminal();
        }

        throw new SyntaxError(`Unexpected ${this.#lookahead!.type} found in a right hind side value`);
    }

    /**
     * Group
     *   = "(", Rhs, ")"
     *   ;
     */
    Group(): Group
    {
        this.eat('(');
        const value = this.Sequence();
        this.eat(')');

        return this.#factory.Group(value);
    }

    /**
     * Repetition
     *   = "{", Rhs, "}"
     *   ;
     */
    Repetition(): Repetition
    {
        this.eat('{');
        const value = this.Sequence();
        this.eat('}');

        return this.#factory.Repetition(value);
    }

    /**
     * Optional
     *   = "[", Rhs, "]"
     *   ;
     */
    Optional(): Optional
    {
        this.eat('[');
        const value = this.Sequence();
        this.eat(']');

        return this.#factory.Optional(value);
    }

    /**
     * Special
     *   = "?", Rhs, "?"
     *   ;
     */
    Special(): Special
    {
        const token = this.eat('special');
        return this.#factory.Special(token.value.slice(1, -1).trim());
    }

    /**
     * Terminal
     *   = TERMINAL
     *   ;
     */
    Terminal(): Terminal
    {
        const token = this.eat('terminal');
        return this.#factory.Terminal(token.value.slice(1, -1).trim());
    }
}