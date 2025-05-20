import { Factory, IdentifierNode, RhsNode, RuleNode, TerminalNode } from "./factory";
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

    get lookahead(): Token|null
    {
        return this.#lookahead;
    }

    parse(value: string)
    {
        this.#tokenizer.read(value);
        this.#lookahead = this.#tokenizer.getNextToken();

        return this.Grammar();
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
    Grammar(): object
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
     *   = Identifier
     *   | Terminal
     *   ;
     */
    Rhs(): RhsNode
    {
        switch(this.#lookahead?.type) {
            case 'terminal':
                return this.Terminal();
            default:
                return this.Identifier();
        }
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