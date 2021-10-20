"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTextBlock = exports.isCompound = exports.isPattern = exports.isVariable = exports.isAtom = exports.getConceptsDeep = exports.filterUniqueConcepts = exports.NULL_CONCEPT = exports.Concept = void 0;
class Concept {
    constructor(inputs) {
        const parts = inputs.parts || [];
        const key = parts.length > 0
            ? Concept.join(inputs.parts)
            : inputs.key || '';
        this.key = key;
        this.parts = parts;
        this.shape = Concept.computeShape(this);
    }
    static computeShape(concept) {
        if (concept.parts.length === 0) {
            return 0;
        }
        const subdims = concept.parts.map(Concept.computeShape);
        if (subdims.every((dim) => dim === 0)) {
            return subdims.length;
        }
        return subdims;
    }
    static createAtom(key) {
        return new Concept({ key });
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
            .map((part) => (part.parts.length >= 2 ? `[${part.key}]` : part.key))
            .join(' ');
    }
    toString() {
        return this.key;
    }
}
exports.Concept = Concept;
exports.NULL_CONCEPT = Concept.createAtom('');
const filterUniqueConcepts = (concepts) => {
    const map = new Map();
    concepts.forEach((concept) => map.set(concept.key, concept));
    return Array.from(map.values());
};
exports.filterUniqueConcepts = filterUniqueConcepts;
const getConceptsDeep = (topConcepts) => {
    const map = new Map();
    topConcepts.forEach((c) => {
        map.set(c.key, c);
        exports.getConceptsDeep(c.parts).forEach((sub) => {
            map.set(sub.key, sub);
        });
    });
    return Array.from(map.values());
};
exports.getConceptsDeep = getConceptsDeep;
const isAtom = (concept) => {
    return concept.parts.length === 0;
};
exports.isAtom = isAtom;
const isVariable = (concept) => {
    return exports.isAtom(concept) && concept.key[0] === '$';
};
exports.isVariable = isVariable;
const isPattern = (concept) => {
    return (exports.isCompound(concept) &&
        concept.parts.some((part) => {
            return exports.isVariable(part) || exports.isPattern(part);
        }));
};
exports.isPattern = isPattern;
const isCompound = (concept) => {
    return concept.parts.length > 1;
};
exports.isCompound = isCompound;
const isTextBlock = (concept) => {
    return concept.key.slice(0, 2) + concept.key.slice(-2) === '<<>>';
};
exports.isTextBlock = isTextBlock;
//# sourceMappingURL=concept.js.map