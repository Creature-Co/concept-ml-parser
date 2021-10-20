export declare type ConceptSequence = Concept[];
export declare type ConceptShape = number | (number | ConceptShape)[];
export declare class Concept {
    key: string;
    parts: ConceptSequence;
    shape: ConceptShape;
    constructor(inputs: {
        key?: string;
        parts?: Concept[];
    });
    static computeShape(concept: Concept): ConceptShape;
    static createAtom(key: string): Concept;
    static createCompound(parts: (Concept | ConceptSequence | string)[]): Concept;
    static join(parts: Concept[]): string;
    toString(): string;
}
export declare const NULL_CONCEPT: Concept;
export declare const filterUniqueConcepts: (concepts: Concept[]) => Concept[];
export declare const getConceptsDeep: (topConcepts: Concept[]) => Concept[];
export declare const isAtom: (concept: Concept) => boolean;
export declare const isVariable: (concept: Concept) => boolean;
export declare const isPattern: (concept: Concept) => boolean;
export declare const isCompound: (concept: Concept) => boolean;
export declare const isTextBlock: (concept: Concept) => boolean;
//# sourceMappingURL=concept.d.ts.map