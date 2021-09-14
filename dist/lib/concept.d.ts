export declare type ConceptSequence = Concept[];
export declare class Concept {
    id: string;
    text: string;
    parts: ConceptSequence;
    constructor(inputs: {
        text?: string;
        parts?: Concept[];
    });
    static idFromText(text: string): string;
    static createAtom(text: string): Concept;
    static createCompound(parts: (Concept | ConceptSequence | string)[]): Concept;
    static join(parts: Concept[]): string;
    toString(): string;
}
export declare const filterUniqueConcepts: (concepts: Concept[]) => Concept[];
export declare const getConceptsDeep: (topConcepts: Concept[]) => Concept[];
export declare const isAtom: (concept: Concept) => boolean;
export declare const isVariable: (concept: Concept) => boolean;
export declare const isPattern: (concept: Concept) => boolean;
export declare const isCompound: (concept: Concept) => boolean;
export declare const isTextBlock: (concept: Concept) => boolean;
//# sourceMappingURL=concept.d.ts.map