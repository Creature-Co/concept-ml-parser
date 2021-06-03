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

export const tokenize = (source: string, tokenKinds: TokenKind[]) => {
  const tokens: Token[] = [];

  let start: Position = {
    offset: 0,
    line: 1,
    column: 0,
  };

  const matchToken = (input: string): Token | null => {
    for (const kind of tokenKinds) {
      const matchedStr: string | null | undefined = kind.match(input);

      if (matchedStr) {
        const lines = matchedStr.split('\n');

        const end: Position = {
          offset: start.offset + matchedStr.length,
          line: start.line + lines.length - 1,
          column:
            lines.length > 0
              ? lines.slice(-1)[0].length
              : start.column + matchedStr.length,
        };

        return {
          kind,
          loc: {
            start,
            end,
            source: matchedStr,
          },
        };
      }
    }

    return null;
  };

  let sub: string = source;

  while (sub.length > 0) {
    const token = matchToken(sub);

    if (!token) {
      throw new Error(
        `Unknown input starting at line ${start.line}, column ${start.column}`,
      );
    }

    tokens.push(token);
    start = token.loc.end;
    sub = sub.slice(token.loc.source.length);
  }

  return tokens;
};

export const RegExpTokenKind = (name: string, pattern: RegExp): TokenKind => ({
  name,
  match: (input) => {
    return (pattern.exec(input) || [])[0];
  },
});

export class TokenError extends Error {
  token: Token;

  constructor(original: Error | string, token: Token) {
    const { line, column } = token.loc.start;
    super(
      `${
        original instanceof Error ? original.message : 'message'
      } (line ${line}, column ${column})`,
    );
    this.token = token;
  }
}
