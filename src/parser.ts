import { ChoiceNode, Factory, GrammarNode, GroupNode, IdentifierNode, OptionalNode, RepetitionNode, RhsNode, RuleNode, SequenceNode, TerminalNode } from "./factory";
import { Token, Tokenizer } from "./tokenizer";

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

    parse(value: string)
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
            throw new SyntaxError(`Unexpected end of input when a ${type} was expected`);

        if (token.type !== type)
            throw new SyntaxError(`Unexpected ${token.type} when a ${type} was expected`);

        this.#lookahead = this.#tokenizer.getNextToken()

        return token;
    }

    /**
     * Grammar
     *   = RuleList
     *   ;
     */
    Grammar(): GrammarNode
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
    RuleList(): Array<RuleNode>
    {
        const rules = [this.Rule()];

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
    Rule(): RuleNode
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
    Identifier(): IdentifierNode
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
    Sequence(): RhsNode
    {
        let left = this.Choice();

        while(this.#lookahead?.type === ',') {
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
    Choice(): RhsNode
    {
        let left = this.Rhs();

        while(this.#lookahead?.type === '|') {
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
    Rhs(): RhsNode
    {
        switch(this.#lookahead!.type) {
            case '(':
                return this.Group();
            case '{':
                return this.Repetition();
            case '[':
                return this.Optional();
            case 'terminal':
                return this.Terminal();
            case 'identifier':
                return this.Identifier();
        }

        throw new SyntaxError(`Unexpected ${this.#lookahead!.type} found in a right hind side value`);
    }

    /**
     * Group
     *   = "(", Rhs, ")"
     *   ;
     */
    Group(): GroupNode
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
    Repetition(): RepetitionNode
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
    Optional(): OptionalNode
    {
        this.eat('[');
        const value = this.Sequence();
        this.eat(']');

        return this.#factory.Optional(value);
    }

    /**
     * Terminal
     *   = TERMINAL
     *   ;
     */
    Terminal(): TerminalNode
    {
        const token = this.eat('terminal');
        return this.#factory.Terminal(token.value.slice(1, -1));
    }
}