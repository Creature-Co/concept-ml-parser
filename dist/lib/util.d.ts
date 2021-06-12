export interface VisitorContext<T> {
    item: T;
    prev?: T;
    next?: T;
    prevAll: () => Generator<T, null>;
    nextAll: () => Generator<T, null>;
}
export declare const combine: <T = any>(left: T[][], right: T[][]) => T[][];
export declare const visitEach: <T = any>(items: T[], visitor: (context: VisitorContext<T>) => any) => void;
//# sourceMappingURL=util.d.ts.map