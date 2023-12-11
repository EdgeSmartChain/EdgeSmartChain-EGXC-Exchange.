import Vue from 'vue'
import store from './store'
import App from './App'
import global from './utils/global'

import Json from './Json' //测试用数据/test data

import uView from "uview-ui";
Vue.use(uView);

import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)
Vue.use(require('vue-moment'));
/**
 *  Because the tool functions belong to EdgeSmartChain's company assets, several commonly used functions are directly mounted on the Vue instance.
  * All test data are stored in the root directory json.js
 *  
 *  The css part uses the global style and iconfont icon under App.vue. If you need an icon library, you can leave a message.
  * The example uses variables under uni.scss. Except for variables, unique syntax has been removed as much as possible and can be directly replaced by other preprocessors.
 */
const navTo = (url)=>{
	uni.navigateTo({
		url: url
	})
}
const msg = (title, duration=1500, mask=false, icon='none', success)=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon,
		success
	});
}
const json = type=>{
	//Simulate asynchronous request data
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const upload = (successCallback, progressCallback)=>{
	uni.chooseImage({
		success: function (chooseImageRes) {
			const tempFilePaths = chooseImageRes.tempFilePaths;
			uni.showLoading({
			    title: '正在上传中.../Uploading...'
			});
			let token = uni.getStorageSync('token')
			const uploadTask = uni.uploadFile({
				url: global.REQUEST_URL + '/v1/common/upload', //
				filePath: tempFilePaths[0],
				name: 'file',
				header: {'Authorization': token},
				success: function (response) {
					uni.hideLoading()
					let res = JSON.parse(response.data)
					if(res.code === 200){
						uni.showToast({title: '上传成功/Upload successful', duration: 2000, icon: 'none'});
					} else {
						uni.showToast({title: res.msg, duration: 2000, icon: 'none'});
					}
					if(successCallback){
						successCallback(res)
					}
				},
				fail: function(error){
					uni.hideLoading()
					uni.showToast({title: '上传失败', duration: 2000, icon: 'none'});
				}
			});
		
			uploadTask.onProgressUpdate(function (res) {
				if(progressCallback){
					progressCallback(res)
				}
				//console.log('-1' + res.progress);
				//console.log('+1' + res.totalBytesSent);
				//console.log('16' + res.totalBytesExpectedToSend);
			});
		}
	})
}


Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, json, prePage, navTo};
Vue.prototype.$g = global;
Vue.prototype.$upload = upload;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
