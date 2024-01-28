import { createApp,ref } from "vue";
const createAppVue = createApp;
const api = createAppVue({
  setup() {
    const url = ref("https://ec-course-api.hexschool.io/v2");
    const path = ref("hsuanin-vue2024");
    const user = ref({
      username: "",
      password: "",
    });

    function submitLogin() {
      axios
        .post(`${url.value}/admin/signin`, user.value)
        //成功的結果
        .then((res) => {
          console.log(res);
          //unix timestamp
          //解構
          const { token, expired } = res.data; //解構
          console.log(token, expired);
          window.location = "products.html";
          // document.cookie = `someCookieName = true; expires = Fri,31 Dec 9999 23:59 GMT;`;
          document.cookie = `hexToken= ${token}; expires=${new Date(
            expired
          )}; path=/`;
        })
        //失敗結果
        .catch((error) => {
          console.dir(error); //用dir可以展開資訊
        });
    }

    return { url, path, user, submitLogin };
  },
});
api.mount("#app");
