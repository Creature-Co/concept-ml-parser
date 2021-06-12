import { SourceLocation, Token } from '../../lib/token';
export interface ASTNode {
    type: string;
    loc?: SourceLocation;
}
export interface Atom extends ASTNode {
    type: 'Atom';
    text: string;
    token: Token;
}
export interface TextBlock extends ASTNode {
    type: 'TextBlock';
    text: string;
    token: Token;
}
export interface Root extends ASTNode {
    type: 'Root';
    children: Permutation[];
}
export interface PermutationBlock extends ASTNode {
    type: 'PermutationBlock';
    children: Permutation[];
}
export interface ParentheticalPermutationBlock extends ASTNode {
    type: 'ParentheticalPermutationBlock';
    children: Permutation[];
}
export interface EmbeddedPermutationBlock extends ASTNode {
    type: 'EmbeddedPermutationBlock';
    children: Permutation[];
}
export declare type Block = PermutationBlock | ParentheticalPermutationBlock | EmbeddedPermutationBlock;
export interface Permutation extends ASTNode {
    type: 'Permutation';
    children: PermutationSegment[];
}
export declare type PermutationSegment = Atom | TextBlock | PermutationBlock | ParentheticalPermutationBlock | EmbeddedPermutationBlock;
//# sourceMappingURL=nodes.d.ts.map