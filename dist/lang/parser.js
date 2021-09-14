"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.astToTokenTree = exports.tokenTreeToConcept = exports.parseConcept = exports.parseConcepts = void 0;
const token_1 = require("../lib/token");
const concept_1 = require("../lib/concept");
const ast_1 = require("./ast");
const tokenKinds = __importStar(require("./token-kinds"));
const util_1 = require("../lib/util");
const parseConcepts = (source) => {
    source = Array.isArray(source) ? source.join('\n') : source;
    const tokens = token_1.tokenize(source, Object.values(tokenKinds));
    const ast = ast_1.parseAST(tokens);
    const tokenTree = exports.astToTokenTree(ast);
    const concepts = concept_1.filterUniqueConcepts(tokenTree.map(exports.tokenTreeToConcept));
    return concepts;
};
exports.parseConcepts = parseConcepts;
const parseConcept = (source) => {
    return exports.parseConcepts(source)[0] || concept_1.NULL_CONCEPT;
};
exports.parseConcept = parseConcept;
const tokenTreeToConcept = (tokenTree) => {
    if (tokenTree.length === 0) {
        return null;
    }
    const parts = tokenTree
        .map((branch) => {
        return Array.isArray(branch)
            ? exports.tokenTreeToConcept(branch)
            : concept_1.Concept.createAtom(branch.loc.source);
    })
        .filter(Boolean);
    if (parts.length === 1) {
        return parts[0];
    }
    return concept_1.Concept.createCompound(parts);
};
exports.tokenTreeToConcept = tokenTreeToConcept;
const astToTokenTree = (root) => {
    const emitted = [];
    const recurse = (node, prevSubPerms = []) => {
        switch (node.type) {
            case 'Atom':
                return [[node.token]];
            case 'TextBlock':
                return [[node.token]];
            case 'Root': {
                const root = node;
                return root.children.flatMap((child) => recurse(child, []));
            }
            case 'PermutationBlock': {
                const block = node;
                return block.children.flatMap((child) => recurse(child, []));
            }
            case 'ParentheticalPermutationBlock': {
                const block = node;
                block.children.forEach((child) => {
                    emitted.push(...util_1.combine(prevSubPerms, recurse(child)));
                });
                return [];
            }
            case 'EmbeddedPermutationBlock': {
                const block = node;
                return block.children.flatMap((child) => {
                    return recurse(child, []).map((embed) => [embed]);
                });
            }
            case 'Permutation': {
                const permutation = node;
                let subPrefixes = [];
                let prevSubPerms = [];
                permutation.children.forEach((segment) => {
                    const subPerms = recurse(segment, prevSubPerms);
                    if (subPrefixes.length === 0) {
                        subPrefixes = subPerms;
                    }
                    else if (subPerms.length > 0) {
                        subPrefixes = subPrefixes.flatMap((left) => {
                            return subPerms.map((right) => {
                                return [...left, ...right];
                            });
                        });
                    }
                    prevSubPerms = subPerms;
                });
                return subPrefixes;
            }
            default:
                throw new Error('Unhandled AST node type: ' + node.type);
        }
    };
    const recursed = recurse(root);
    return [...recursed, ...emitted];
};
exports.astToTokenTree = astToTokenTree;
//# sourceMappingURL=parser.js.map