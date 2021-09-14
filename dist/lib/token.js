"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenError = exports.RegExpTokenKind = exports.tokenize = void 0;
const tokenize = (source, tokenKinds) => {
    const tokens = [];
    let start = {
        offset: 0,
        line: 1,
        column: 1,
    };
    const matchToken = (input) => {
        for (const kind of tokenKinds) {
            const matchedStr = kind.match(input);
            if (matchedStr) {
                const lines = matchedStr.split('\n');
                const end = {
                    offset: start.offset + matchedStr.length,
                    line: start.line + lines.length - 1,
                    column: lines.length > 0
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
    let sub = source;
    while (sub.length > 0) {
        const token = matchToken(sub);
        if (!token) {
            throw new Error(`Unknown input starting at line ${start.line}, column ${start.column}`);
        }
        tokens.push(token);
        start = token.loc.end;
        sub = sub.slice(token.loc.source.length);
    }
    return tokens;
};
exports.tokenize = tokenize;
const RegExpTokenKind = (name, pattern) => ({
    name,
    match: (input) => {
        return (pattern.exec(input) || [])[0];
    },
});
exports.RegExpTokenKind = RegExpTokenKind;
class TokenError extends Error {
    constructor(original, token) {
        const { line, column } = token.loc.start;
        super(`${original instanceof Error ? original.message : 'message'} (line ${line}, column ${column})`);
        this.token = token;
    }
}
exports.TokenError = TokenError;
//# sourceMappingURL=token.js.map