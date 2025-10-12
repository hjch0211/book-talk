import * as jsonpatch from 'fast-json-patch';

type Response = {
    op: string
    path: string
    value?: any
    from?: string | undefined
}[]

export const useJsonPatch = () => {
    const compare = (origin: JSON, updated: JSON): Response => {
        return jsonpatch.compare(origin, updated);
    };

    return {compare};
};