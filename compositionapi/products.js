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
              getProducts();
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
            tempProduct.value = {
              imagesUrl: [],
            };
            isNew.value = true;
            this.$refs.pModal.openModal();
          } else if (status === "edit") {
            tempProduct.value = { ...item };
            isNew.value = false;
            this.$refs.pModal.openModal();
          } else if (status === "delete") {
            tempProduct.value = { ...item };
            if(!Array.isArray(tempProduct.value.imagesUrl)){
              tempProduct.value.imagesUrl = [];
            }
            isNew.value = false;
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
              products.value = products;
              pagination.value = pagination;
              console.log(this.products);
            })
            .catch((error) => {
              alert(error.response.data.message);
              console.log(error);
              window.location = "login.html";
            });
        }
        function updateProduct() {
          let updateOrNewUrl = `${url}/api/${path}/admin/product/${tempProduct.value.id}`;
          let http = "put";
          if (isNew.value) {
            updateOrNewUrl = `${url}/api/${path}/admin/product`;
            http = "post";
          }
          axios[http](updateOrNewUrl, { data: tempProduct.value })
            .then((res) => {
              alert(res.data.message);
              this.$refs.pModal.closeModal();
              getProducts(); //取得所有產品
            })
            .catch((error) => {
              alert(error.response.data.message);
            });
        }
        function delProduct() {
          const deleteUrl = `${url}/api/${path}/admin/product/${tempProduct.value.id}`;
          axios
            .delete(deleteUrl)
            .then((res) => {
              alert(res.data.message);
              this.$refs.dModal.closeModal();
              getProducts(); //更新所有產品
            })
            .catch((error) => {
              alert(error.response.data.message);
            });
        }
        function createImages() {
          tempProduct.value.imagesUrl = [];
          tempProduct.value.imagesUrl.push("");
        }
        onMounted(()=> {
          const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
          );
          // console.log(token);
          axios.defaults.headers.common["Authorization"] = token;
          checkLogin();
        })
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
