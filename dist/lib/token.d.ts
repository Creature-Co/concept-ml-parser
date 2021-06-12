export interface Token {
    loc: SourceLocation;
    kind: TokenKind;
}
export interface TokenKind {
    name: string;
    match: (input: string) => string | null | undefined;
}
export interface SourceLocation {
    source: string | null;
    start: Position;
    end: Position;
}
export interface Position {
    line: number;
    column: number;
    offset: number;
}
export declare const tokenize: (source: string, tokenKinds: TokenKind[]) => Token[];
export declare const RegExpTokenKind: (name: string, pattern: RegExp) => TokenKind;
export declare class TokenError extends Error {
    token: Token;
    constructor(original: Error | string, token: Token);
}
//# sourceMappingURL=token.d.ts.map