import { ConceptSetSource } from '../lang/parser';
import { Concept } from './concept';
export interface Template<TVariable extends string> {
    patterns: Concept[];
    interpolate: (variables: VariableSourceDict<TVariable>) => Concept[];
}
export declare const createTemplate: <TVariable extends string>(source: ConceptSetSource) => Template<TVariable>;
export interface RuleMatch {
    pattern: Concept;
    concept: Concept;
    variables: VariableDict;
}
export interface RuleSetMatch {
    ruleMatches: RuleMatch[];
    variables: VariableDict;
}
export interface VariableDict {
    [key: string]: Concept;
}
export declare type VariableSourceDict<TVariable extends string = string> = {
    [key in TVariable]: ConceptSetSource;
};
export declare const getPatternMatches: (patterns: Concept[], concepts: Concept[]) => RuleMatch[];
export declare const interpolate: (pattern: string | Concept, variables: VariableDict) => string;
export declare const interpolateToConcept: (pattern: Concept, variables: {
    [key: string]: string | Concept | (string | Concept)[];
}) => Concept;
export declare const interpolateToConcepts: (patternSource: ConceptSetSource, variables: {
    [key: string]: ConceptSetSource;
}) => Concept[];
export declare const extractVariables: (concept: Concept, pattern: Concept) => null | VariableDict;
export declare const getPatternVariables: (...patterns: Concept[] | Concept[][]) => Concept[];
//# sourceMappingURL=pattern.d.ts.map