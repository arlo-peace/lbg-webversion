
/**
 * 获取IDFA
 * 仅iOS平台支持
 */
function getIdfa(){
	var idfa = '';
	try{
		if('iOS' == plus.os.name){
			var manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
			if(plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')){
				var identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
				idfa = plus.ios.invoke(identifier, 'UUIDString');
				plus.ios.deleteObject(identifier);
			}
			plus.ios.deleteObject(manager);
		}
	}catch(e){
		console.error('exception in getIdfa@dc-idfa!!');
	}
	return idfa;
}

module.exports = {
	value: getIdfa
}
