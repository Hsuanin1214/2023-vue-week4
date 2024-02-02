import { createApp,ref,onMounted } from "vue";
import paginationComponent from "./components/paginationComponent.js";
import productModalComponent from "./components/productModalComponent.js";
import deleteModalComponent from "./components/deleteModalComponent.js";

// let productModal = null;
// let deleteProductModal = null;
//因為有其他元件也會使用到，因此將url相關資訊寫在全域
const url = "https://ec-course-api.hexschool.io/v2";
const path = "hsuanin-vue2024";

const app = createApp({
  setup() {
      const isNew = ref(false);
      const products = ref([]);
      const tempProduct = ref({
        imagesUrl: [],
      });
      const pagination = ref({});
      function checkLogin() {
          console.log(url);
          axios
            .post(`${url}/api/user/check`)
            //成功的結果
            .then((res) => {
              console.log(res);
              this.getProducts();
            })
            //失敗結果
            .catch((error) => {
              console.dir(error); //用dir可以展開資訊
              alert("未登入");
              window.location = "login.html";
            });
        }
        function openModal(status, item) {
          if (status === "new") {
            this.tempProduct = {
              imagesUrl: [],
            };
            this.isNew = true;
            this.$refs.pModal.openModal();
          } else if (status === "edit") {
            this.tempProduct = { ...item };
            this.isNew = false;
            this.$refs.pModal.openModal();
          } else if (status === "delete") {
            this.tempProduct = { ...item };
            if(!Array.isArray(this.tempProduct.imagesUrl)){
              this.tempProduct.imagesUrl = [];
            }
            this.isNew = false;
            this.$refs.dModal.openModal();
          }
        }
        function getProducts(page = 1) {
          //給參數預設值
          const getUrl = `${url}/api/${path}/admin/products?page=${page}`; //(query)為網址參數寫法，page參數帶入，取得當前頁碼的產品資料
          axios
            .get(getUrl)
            .then((res) => {
              console.log(res.data);
              const { products, pagination } = res.data;
              this.products = products;
              this.pagination = pagination;
              console.log(this.products);
            })
            .catch((error) => {
              alert(error.response.data.message);
              console.log(error);
              window.location = "login.html";
            });
        }
        function updateProduct() {
          let updateOrNewUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
          let http = "put";
          if (this.isNew) {
            updateOrNewUrl = `${url}/api/${path}/admin/product`;
            http = "post";
          }
          axios[http](updateOrNewUrl, { data: this.tempProduct })
            .then((res) => {
              alert(res.data.message);
              this.$refs.pModal.closeModal();
              this.getProducts(); //取得所有產品
            })
            .catch((error) => {
              alert(error.response.data.message);
            });
        }
        function delProduct() {
          const deleteUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
          axios
            .delete(deleteUrl)
            .then((res) => {
              alert(res.data.message);
              this.$refs.dModal.closeModal();
              this.getProducts(); //更新所有產品
            })
            .catch((error) => {
              alert(error.response.data.message);
            });
        }
        function createImages() {
          this.tempProduct.imagesUrl = [];
          this.tempProduct.imagesUrl.push("");
        }
        onMounted()=> {
          const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
          );
          // console.log(token);
          axios.defaults.headers.common["Authorization"] = token;
          this.checkLogin();
        }
        components:{ //components要加s，因為可能有很多個子元件
          paginationComponent,
          productModalComponent,
          deleteModalComponent
        }
        return {
          isNew,products,tempProduct,imagesUrl,pagination,checkLogin,updateProduct,delProduct,createImages
        };
  }
});
// app.component('pagination-component',PaginationComponent); // 區域註冊
// app.component('productModalComponent',ProductModalComponent); // 區域註冊
app.mount("#app");
