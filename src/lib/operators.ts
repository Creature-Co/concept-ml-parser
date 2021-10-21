import { isAtom, isCompound } from '..';
import { Concept } from './concept';

export const applyAmpersandOperator = (concept: Concept) => {
  if (isAtom(concept)) {
    return concept;
  }

  const [replacement, ...rest] = concept.parts;
  let didApplyAmpersand = false;

  const recurse = (part: Concept): Concept => {
    if (isCompound(part)) {
      return Concept.createCompound(part.parts.map(recurse));
    }

    if (part.key === '&') {
      didApplyAmpersand = true;
      return replacement;
    }

    return part;
  };

  const replacedRest = rest.map(recurse);

  return didApplyAmpersand ? Concept.createCompound(replacedRest) : concept;
};
