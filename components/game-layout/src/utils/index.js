
/**
 * paramsToJson
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
export const paramsToJson = url=>{
    var hash;
    var json = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        json[hash[0]] = hash[1];
    }
    return json;
}


 
export default paramsToJson