const convTable = {
    d: '0',
    a: '1',
    n: '2',
    i: '3',
    e: '4',
    l: '5',
    z: '6',
    o: '7',
    h: '8',
    y: '9',
};

const shareRe = /[^a-zA-Z0-9]/;
const detailRe = /[^danielzohy]/;
const apiRe = /[^0-9]/;

function shareId2ApiId(id: string): string {
    if (shareRe.test(id)) {
        throw new Error('Invalid ID from shared url');
    }
    let apiId = 0;
    for (const c of id) {
        apiId *= 62;
        const val = c.charCodeAt(0);
        // a-z -> 0-25
        if (97 <= val && val <= 122) {
            apiId += val - 97;
        }
        // A-Z -> 26-51
        else if (65 <= val && val <= 90) {
            apiId += val - 39;
        }
        // 0-9 -> 52-61
        else if (48 <= val && val <= 57) {
            apiId += val + 4;
        }
    }
    return apiId.toString();
}

function detailId2ApiId(id: string): string {
    if (detailRe.test(id)) {
        throw new Error('Invalid ID from detail page url');
    }
    let apiId = '';
    for (const c of id) {
        apiId += convTable[c];
    }
    return apiId;
}

function convDate(dateString: string): Date {
    return new Date(
        dateString.slice(0, 4) +
            '-' +
            dateString.slice(4, 6) +
            '-' +
            dateString.slice(6, 8),
    );
}

export { shareId2ApiId, detailId2ApiId, convDate };
