import { Token } from '../lib/token';
import { Concept } from '../lib/concept';
import { ASTNode, Root } from './ast/nodes';
export interface ParseConceptsResult {
    source: string;
    tokens: Token[];
    ast: Root;
    tokenTree: TokenTree;
    concepts: Concept[];
}
export declare type TokenTree = (Token | TokenTree)[];
export declare const parseConcepts: (source: string | string[]) => Concept[];
export declare const parseConcept: (source: string) => Concept;
export declare const tokenTreeToConcept: (tokenTree: TokenTree) => Concept | null;
export declare const astToTokenTree: (root: ASTNode) => TokenTree;
//# sourceMappingURL=parser.d.ts.map