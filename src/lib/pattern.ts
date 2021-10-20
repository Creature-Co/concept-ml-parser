import { uniqBy } from 'lodash';
import { ConceptSetSource, parseConcept, toConcepts } from '../lang/parser';
import { Concept, isPattern, isVariable } from './concept';

export interface Template<TVariable extends string> {
  patterns: Concept[];
  interpolate: (variables: VariableSourceDict<TVariable>) => Concept[];
}

export const createTemplate = <TVariable extends string>(
  source: ConceptSetSource,
): Template<TVariable> => {
  const patterns = toConcepts(source);
  const interpolate = interpolateToConcepts.bind(null, patterns);

  return {
    patterns,
    interpolate,
  };
};

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

export type VariableSourceDict<TVariable extends string = string> = {
  [key in TVariable]: ConceptSetSource;
};

export const getPatternMatches = (
  patterns: Concept[],
  concepts: Concept[],
): RuleMatch[] => {
  const matches: RuleMatch[] = [];

  patterns.forEach((pattern) => {
    const size = pattern.parts.length;

    concepts
      .filter((concept) => {
        return concept.parts.length === size && concept.key !== pattern.key;
      })
      .forEach((concept) => {
        const variables = extractVariables(concept, pattern);

        if (variables) {
          matches.push({
            pattern,
            concept,
            variables,
          });
        }
      });
  });

  return matches;
};

export const interpolate = (
  pattern: string | Concept,
  variables: VariableDict,
): string => {
  if (typeof pattern === 'string') {
    return interpolate(parseConcept(pattern), variables);
  }

  return interpolateToConcept(pattern, variables).key;
};

export const interpolateToConcept = (
  pattern: Concept,
  variables: VariableSourceDict,
): Concept => {
  if (isPattern(pattern)) {
    return Concept.createCompound(
      pattern.parts.map((part) => {
        return interpolateToConcept(part, variables);
      }),
    );
  } else if (variables[pattern.key]) {
    return toConcepts(variables[pattern.key])[0];
  } else {
    return pattern;
  }
};

export const interpolateToConcepts = (
  patternSource: ConceptSetSource,
  variables: VariableSourceDict,
): Concept[] => {
  const patterns: Concept[] = toConcepts(patternSource);
  const variableConceptDict: { [key: string]: Concept[] } = {};

  Object.entries(variables).forEach(([key, source]) => {
    variableConceptDict[key] = toConcepts(source);
  });

  const concepts = Object.entries(variableConceptDict).reduce(
    (partials, [k, values]) => {
      return values.flatMap((v) => {
        return partials.map((partial) => {
          return interpolateToConcept(partial, { [k]: v });
        });
      });
    },
    patterns,
  );

  return uniqBy(concepts, (c) => c.key);
};

export const extractVariables = (
  concept: Concept,
  pattern: Concept,
): null | VariableDict => {
  const size = pattern.parts.length;

  if (concept.parts.length !== size) {
    return null;
  }

  const variables: VariableDict = {};

  for (let i = 0; i < size; i += 1) {
    const conceptPart = concept.parts[i];
    const patternPart = pattern.parts[i];

    if (isVariable(patternPart)) {
      const variableKey = patternPart.key;
      const existingVariable = variables[variableKey];

      if (existingVariable && existingVariable.key !== conceptPart.key) {
        return null;
      }

      variables[variableKey] = conceptPart;
    } else if (isPattern(patternPart)) {
      const subVariables = extractVariables(conceptPart, patternPart);

      if (!subVariables) {
        return null;
      }

      for (const [variableKey, variable] of Object.entries(subVariables)) {
        const existingVariable = variables[variableKey];

        if (existingVariable && existingVariable.key !== variable.key) {
          return null;
        }

        variables[variableKey] = variable;
      }
    } else if (conceptPart.key !== patternPart.key) {
      return null;
    }
  }

  return variables;
};

export const getPatternVariables = (...patterns: Concept[] | Concept[][]) => {
  const map = new Map<string, Concept>();

  patterns.flat().forEach((pattern) => {
    if (isVariable(pattern)) {
      map.set(pattern.key, pattern);
    } else if (isPattern(pattern)) {
      getPatternVariables(pattern.parts).forEach((variable) => {
        map.set(variable.key, variable);
      });
    }
  });

  return Array.from(map.values());
};
