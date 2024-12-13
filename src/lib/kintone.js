const API = import.meta.env.KINTONE_API;
//const SPACE = import.meta.env.KINTONE_SPACE_ID;
const TOKEN = import.meta.env.KINTONE_API_TOKEN;
const PAGE_APP_ID = import.meta.env.KINTONE_PAGE_APP_ID;
const CATEGORIES = [
    {
        name: '暮らし・手続き',
        slug: 'life',
    },
    {
        name: '健康・福祉',
        slug: 'health',
    },
    {
        name: '子育て・教育',
        slug: 'kyoiku',
    },
    {
        name: 'まち案内',
        slug: 'machi',
    },
]
let cacheAllPages = [];

async function apiCall(query, variables) {
    const fetchUrl = API;
    const options = {
        method: 'GET',
        headers: {
            'X-Cybozu-API-Token': TOKEN
        }
    }
    console.debug(fetchUrl + "?" + new URLSearchParams(query), options, variables);
    return await fetch(fetchUrl + "?" + new URLSearchParams(query), options);
}

function getAllCategories() {
    return CATEGORIES;
}

function getCategoryByName(name) {
    const categories = getAllCategories();
    for (const cat of categories) {
        if (cat.name == name) {
            return cat;
        }
    }
    return;
}

function longSlug(page) {
    if (!page.$category) {
        return page.slug.value;
    }
    return page.slug.value != ''
        ? page.$category.slug + '/' + page.slug.value
        : page.$category.slug
}

function pagePath(page) {
    const path = [
        {
            name: 'ホーム',
            slug: ''
        }
    ]
    if (page.$category) {
        path.push(page.$category);
    }
    if (page.slug.value != '') {
        path.push({
            name: page.title.value,
            slug: page.$slug,
        })
    }
    return path;
}

async function getAllPages() {
    // stale cache in development
    if (!import.meta.env?.DEV && cacheAllPages) {

    }
    const query = {
        app: PAGE_APP_ID
    }
    const response = await apiCall(query);
    const json = await response.json();
    const records = await json.records;

    // array -> hash[id]
    const pages = Object.fromEntries(records.map(x => {
        x.$category = getCategoryByName(x.category.value);
        x.$slug = longSlug(x);
        x.$path = pagePath(x);
        return [x.$id.value, x];
    }));

    cacheAllPages = pages;
    return cacheAllPages;
}

async function getPageById(id) {
    let pages;
    if (cacheAllPages) {
        pages = cacheAllPages;
    } else {
        pages = await getAllPages();
    }
    return pages[id];
}

export const client = { getAllPages, getPageById }
