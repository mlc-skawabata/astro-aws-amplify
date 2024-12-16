export function onRequest (context, next) {
    // リクエストからデータをインターセプトします
    // 必要に応じて、`locals`内のプロパティを改変します
    //console.trace("middleare");
    //console.log(context.url);

    // Responseか`next()`の結果を返します
    return next();

};