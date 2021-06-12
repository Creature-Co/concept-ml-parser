"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAST = void 0;
const token_1 = require("../../lib/token");
const util_1 = require("../../lib/util");
const parser_state_1 = require("./parser-state");
const token_kinds_1 = require("../token-kinds");
const parseAST = (tokens) => {
    const state = new parser_state_1.ASTParserState();
    util_1.visitEach(tokens, ({ item }) => {
        try {
            switch (item.kind) {
                // Atoms and text blocks
                case token_kinds_1.AtomKind:
                    state.consumeAtomToken(item);
                    break;
                case token_kinds_1.TextBlockKind:
                    state.consumeTextBlockToken(item);
                    break;
                // Permutation blocks
                case token_kinds_1.CurlyLeftKind:
                    state.startPermutationBlock('PermutationBlock');
                    break;
                case token_kinds_1.CurlyRightKind:
                    state.endPermutationBlock();
                    break;
                // Embedded permutation blocks
                case token_kinds_1.SquareLeftKind:
                    state.startPermutationBlock('EmbeddedPermutationBlock');
                    break;
                case token_kinds_1.SquareRightKind:
                    state.endPermutationBlock();
                    break;
                // Parenthetical permutation blocks
                case token_kinds_1.ParenLeftKind:
                    state.startPermutationBlock('ParentheticalPermutationBlock');
                    break;
                case token_kinds_1.ParenRightKind:
                    state.endPermutationBlock();
                    break;
                // Permutation separators
                case token_kinds_1.CommaKind:
                    state.nextPermutation();
                    break;
                case token_kinds_1.SemicolonKind:
                    state.nextPermutation();
                    break;
                case token_kinds_1.NewlineSeparatorKind:
                    state.nextPermutation();
                    break;
                default:
                    break;
            }
        }
        catch (err) {
            throw new token_1.TokenError(err, item);
        }
    });
    return state.end().root;
};
exports.parseAST = parseAST;
//# sourceMappingURL=index.js.map