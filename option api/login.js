import { createApp } from "vue";
createApp({
		data() {
			return {
				url: "https://ec-course-api.hexschool.io/v2",
				path: "hsuanin-vue2024",
				user: {
					username : "",
					password : "",
				},
			};
		},
		methods: {
			submitLogin() {
				console.log(this.user.username, this.user.password);
				axios
					.post(`${this.url}/admin/signin`, this.user)
					//成功的結果
					.then((res) => {
						console.log(res);
						//unix timestamp
						//解構
						const { token, expired } = res.data; //解構
						console.log(token, expired);
						window.location = 'products.html';
						// document.cookie = `someCookieName = true; expires = Fri,31 Dec 9999 23:59 GMT;`;
						document.cookie = `hexToken= ${token}; expires=${new Date(expired)}; path=/`;
					})
					//失敗結果
					.catch((error) => {
						console.dir(error); //用dir可以展開資訊
					});
			},
		},
		mounted() {
		},
}).mount("#app");
