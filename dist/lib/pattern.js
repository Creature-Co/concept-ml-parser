"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatternVariables = exports.extractVariables = exports.interpolateToConcepts = exports.interpolateToConcept = exports.interpolate = exports.getPatternMatches = exports.createTemplate = void 0;
const lodash_1 = require("lodash");
const parser_1 = require("../lang/parser");
const concept_1 = require("./concept");
const createTemplate = (source) => {
    const patterns = parser_1.toConcepts(source);
    const interpolate = exports.interpolateToConcepts.bind(null, patterns);
    return {
        patterns,
        interpolate,
    };
};
exports.createTemplate = createTemplate;
const getPatternMatches = (patterns, concepts) => {
    const matches = [];
    patterns.forEach((pattern) => {
        const size = pattern.parts.length;
        concepts
            .filter((concept) => {
            return concept.parts.length === size && concept.key !== pattern.key;
        })
            .forEach((concept) => {
            const variables = exports.extractVariables(concept, pattern);
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
exports.getPatternMatches = getPatternMatches;
const interpolate = (pattern, variables) => {
    if (typeof pattern === 'string') {
        return exports.interpolate(parser_1.parseConcept(pattern), variables);
    }
    return exports.interpolateToConcept(pattern, variables).key;
};
exports.interpolate = interpolate;
const interpolateToConcept = (pattern, variables) => {
    if (concept_1.isPattern(pattern)) {
        return concept_1.Concept.createCompound(pattern.parts.map((part) => {
            return exports.interpolateToConcept(part, variables);
        }));
    }
    else if (variables[pattern.key]) {
        return parser_1.toConcepts(variables[pattern.key])[0];
    }
    else {
        return pattern;
    }
};
exports.interpolateToConcept = interpolateToConcept;
const interpolateToConcepts = (patternSource, variables) => {
    const patterns = parser_1.toConcepts(patternSource);
    const variableConceptDict = {};
    Object.entries(variables).forEach(([key, source]) => {
        variableConceptDict[key] = parser_1.toConcepts(source);
    });
    const concepts = Object.entries(variableConceptDict).reduce((partials, [k, values]) => {
        return values.flatMap((v) => {
            return partials.map((partial) => {
                return exports.interpolateToConcept(partial, { [k]: v });
            });
        });
    }, patterns);
    return lodash_1.uniqBy(concepts, (c) => c.key);
};
exports.interpolateToConcepts = interpolateToConcepts;
const extractVariables = (concept, pattern) => {
    const size = pattern.parts.length;
    if (concept.parts.length !== size) {
        return null;
    }
    const variables = {};
    for (let i = 0; i < size; i += 1) {
        const conceptPart = concept.parts[i];
        const patternPart = pattern.parts[i];
        if (concept_1.isVariable(patternPart)) {
            const variableKey = patternPart.key;
            const existingVariable = variables[variableKey];
            if (existingVariable && existingVariable.key !== conceptPart.key) {
                return null;
            }
            variables[variableKey] = conceptPart;
        }
        else if (concept_1.isPattern(patternPart)) {
            const subVariables = exports.extractVariables(conceptPart, patternPart);
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
        }
        else if (conceptPart.key !== patternPart.key) {
            return null;
        }
    }
    return variables;
};
exports.extractVariables = extractVariables;
const getPatternVariables = (...patterns) => {
    const map = new Map();
    patterns.flat().forEach((pattern) => {
        if (concept_1.isVariable(pattern)) {
            map.set(pattern.key, pattern);
        }
        else if (concept_1.isPattern(pattern)) {
            exports.getPatternVariables(pattern.parts).forEach((variable) => {
                map.set(variable.key, variable);
            });
        }
    });
    return Array.from(map.values());
};
exports.getPatternVariables = getPatternVariables;
//# sourceMappingURL=pattern.js.map