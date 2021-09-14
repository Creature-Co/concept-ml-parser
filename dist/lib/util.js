"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullConcept = exports.visitEach = exports.combine = void 0;
const combine = (left, right) => {
    if (left.length === 0) {
        return right;
    }
    if (right.length === 0) {
        return left;
    }
    return left.flatMap((l) => {
        return right.map((r) => [...l, ...r]);
    });
};
exports.combine = combine;
const visitEach = (items, visitor) => {
    items.forEach((item, i) => {
        visitor({
            item: items[i],
            prev: items[i - 1],
            next: items[i + 1],
            prevAll: function* () {
                for (let j = i - 1; j >= 0; j -= 1) {
                    yield items[j];
                }
                return null;
            },
            nextAll: function* () {
                for (let j = i + 1; j < items.length; j += 1) {
                    yield items[j];
                }
                return null;
            },
        });
    });
};
exports.visitEach = visitEach;
const isNullConcept = (concept) => {
    return concept.text === '';
};
exports.isNullConcept = isNullConcept;
//# sourceMappingURL=util.js.map