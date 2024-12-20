import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const API = import.meta.env.KINTONE_API;
const API_BASE_URL = import.meta.env.KINTONE_API_BASE_URL;
const PAGE_APP_ID = import.meta.env.KINTONE_PAGE_APP_ID;
const PAGE_APP_API_TOKEN = import.meta.env.KINTONE_PAGE_APP_API_TOKEN;
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

// async function apiCall(query, token, variables) {
//     const fetchUrl = API;
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-Cybozu-API-Token': token
//         }
//     }
//     console.debug(fetchUrl + "?" + new URLSearchParams(query), options, variables);
//     return await fetch(fetchUrl + "?" + new URLSearchParams(query), options);
// }

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
    // const query = {
    //     app: PAGE_APP_ID
    // }
    // const response = await apiCall(query, PAGE_APP_API_TOKEN);
    // const json = await response.json();
    const client = new KintoneRestAPIClient({
        baseUrl: API_BASE_URL,
        auth: { apiToken: PAGE_APP_API_TOKEN}
    })
    const response = await client.record.getRecords({ app: PAGE_APP_ID })
    const records = response.records;

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
