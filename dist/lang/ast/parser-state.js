"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTParserState = void 0;
const token_1 = require("../../lib/token");
const token_kinds_1 = require("../token-kinds");
class ASTParserState {
    constructor() {
        const permutation = {
            type: 'Permutation',
            children: [],
        };
        const root = {
            type: 'Root',
            children: [permutation],
        };
        this.context = { permutation, block: root };
        this.root = root;
    }
    end() {
        let context = this.context;
        while (context) {
            this.terminatePermutation();
            context = context.parent;
        }
        return this;
    }
    terminatePermutation() {
        if (this.context.permutation.children.length === 0) {
            this.context.block.children.pop();
        }
        return this;
    }
    consumeAtomToken(token) {
        if (token.kind !== token_kinds_1.AtomKind) {
            throw new token_1.TokenError('Token must be an Atom', token);
        }
        const atom = {
            token,
            type: 'Atom',
            text: token.loc.source,
        };
        this.context.permutation.children.push(atom);
        return this;
    }
    consumeTextBlockToken(token) {
        if (token.kind !== token_kinds_1.TextBlockKind) {
            throw new token_1.TokenError('Token must be a TextBlock', token);
        }
        const textBlock = {
            token,
            type: 'TextBlock',
            text: token.loc.source,
        };
        this.context.permutation.children.push(textBlock);
        return this;
    }
    nextPermutation() {
        this.terminatePermutation();
        const permutation = {
            type: 'Permutation',
            children: [],
        };
        this.context.block.children.push(permutation);
        this.context.permutation = permutation;
        return this;
    }
    startPermutationBlock(type) {
        const permutation = {
            type: 'Permutation',
            children: [],
        };
        const block = {
            type,
            children: [permutation],
        };
        this.context.permutation.children.push(block);
        this.context = {
            block,
            permutation,
            parent: this.context,
        };
        return this;
    }
    endPermutationBlock() {
        const { parent } = this.context;
        if (!parent) {
            throw new Error('Unexpected block ending');
        }
        this.terminatePermutation();
        this.context = this.context.parent;
        return this;
    }
}
exports.ASTParserState = ASTParserState;
//# sourceMappingURL=parser-state.js.map