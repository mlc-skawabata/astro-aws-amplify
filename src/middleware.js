export function onRequest (context, next) {
    // リクエストからデータをインターセプトします
    // 必要に応じて、`locals`内のプロパティを改変します
    //console.trace("middleare");
    // Responseか`next()`の結果を返します

    return next();
};