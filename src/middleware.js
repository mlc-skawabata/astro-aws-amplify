export function onRequest (context, next) {
    // リクエストからデータをインターセプトします
    // 必要に応じて、`locals`内のプロパティを改変します
    //console.trace("middleare");
    console.log(import.meta.env);
    if (context.url.pathname == '/life/') {
        console.log(context.url);
        //return context.rewrite(new Request("/life/index.html"));
    }

    // Responseか`next()`の結果を返します
    return next();

};