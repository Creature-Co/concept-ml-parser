import { Token } from '../../lib/token';
import { Block, Root, Permutation } from './nodes';
export interface ASTParserContext {
    parent?: ASTParserContext;
    block: Block | Root;
    permutation: Permutation;
}
export declare class ASTParserState {
    root: Root;
    context: ASTParserContext;
    constructor();
    end(): this;
    terminatePermutation(): this;
    consumeAtomToken(token: Token): this;
    consumeTextBlockToken(token: Token): this;
    nextPermutation(): this;
    startPermutationBlock(type: Block['type']): this;
    endPermutationBlock(): this;
}
//# sourceMappingURL=parser-state.d.ts.map