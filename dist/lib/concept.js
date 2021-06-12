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
exports.filterUniqueConcepts = exports.Concept = void 0;
const uuid = __importStar(require("uuid"));
const UUID_NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
class Concept {
    constructor(inputs) {
        const parts = inputs.parts || [];
        const text = parts.length > 0 ? Concept.join(inputs.parts) : inputs.text || '';
        this.id = uuid.v5(text, UUID_NAMESPACE_OID);
        this.text = text;
        this.parts = parts;
        this.token = inputs.token;
    }
    static createAtom(text) {
        return new Concept({ text });
    }
    static createCompound(parts) {
        return new Concept({
            parts: parts.map((part) => {
                if (Array.isArray(part)) {
                    return Concept.createCompound(part);
                }
                if (part instanceof Concept) {
                    return part;
                }
                return Concept.createAtom(part);
            }),
        });
    }
    static join(parts) {
        return parts
            .map((part) => (part.parts.length >= 2 ? `[${part.text}]` : part.text))
            .join(' ');
    }
}
exports.Concept = Concept;
const filterUniqueConcepts = (concepts) => {
    const map = new Map();
    concepts.forEach((concept) => map.set(concept.id, concept));
    return Array.from(map.values());
};
exports.filterUniqueConcepts = filterUniqueConcepts;
//# sourceMappingURL=concept.js.map