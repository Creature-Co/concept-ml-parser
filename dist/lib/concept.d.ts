import { Token } from './token';
export declare type ConceptSequence = Concept[];
export declare class Concept {
    id: string;
    text: string;
    parts: ConceptSequence;
    token?: Token;
    constructor(inputs: {
        text?: string;
        parts?: Concept[];
        token?: Token;
    });
    static createAtom(text: string): Concept;
    static createCompound(parts: (Concept | ConceptSequence | string)[]): any;
    static join(parts: Concept[]): string;
}
export declare const filterUniqueConcepts: (concepts: Concept[]) => Concept[];
//# sourceMappingURL=concept.d.ts.map