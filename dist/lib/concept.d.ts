export declare type ConceptSequence = Concept[];
export declare class Concept {
    id: string;
    text: string;
    parts: ConceptSequence;
    constructor(inputs: {
        text?: string;
        parts?: Concept[];
    });
    static createAtom(text: string): Concept;
    static createCompound(parts: (Concept | ConceptSequence | string)[]): Concept;
    static join(parts: Concept[]): string;
    toString(): string;
}
export declare const filterUniqueConcepts: (concepts: Concept[]) => Concept[];
//# sourceMappingURL=concept.d.ts.map