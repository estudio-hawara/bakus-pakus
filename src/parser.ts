import { Factory, GrammarNode, IdentifierNode, RhsNode, RuleNode, TerminalNode } from "./factory";
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
     *   , Rhs
     */
    Rule(): RuleNode
    {
        const identifier = this.Identifier();
        this.eat('=');
        const rhs = this.Rhs();
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
     * Rhs
     *   = Terminal
     *   | Identifier
     *   ;
     */
    Rhs(): RhsNode
    {
        switch(this.#lookahead!.type) {
            case 'terminal':
                return this.Terminal();
            case 'identifier':
                return this.Identifier();
        }

        throw new SyntaxError(`Unexpected ${this.#lookahead!.type} found in a right hind side value`);
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