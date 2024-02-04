import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import paginationComponent from "./components/paginationComponent.js";
import productModalComponent from "./components/productModalComponent.js";
import deleteModalComponent from "./components/deleteModalComponent.js";

//因為有其他元件也會使用到，因此將url相關資訊寫在全域
const url = "https://ec-course-api.hexschool.io/v2";
const path = "hsuanin-vue2024";
const createAppVue = createApp;
const app = createAppVue({
  setup() {
    const isNew = ref(false);
    const products = ref([]);
    const tempProduct = ref({
      imagesUrl: [],
    });
    const pagination = ref({});
    //option api 的 refs 改變
    const pModal = ref(null);
    const dModal = ref(null);

    const checkLogin = async () => {
      try {
        await axios.post(`${url}/api/user/check`);
        //成功的結果
        getProducts();
      } catch (error) {
        //失敗結果
        console.dir(error); //用dir可以展開資訊
        alert("未登入");
        window.location = "login.html";
      }
    };
    function openModal(status, item) {
      if (status === "new") {
        tempProduct.value = {
          imagesUrl: [],
        };
        isNew.value = true;
        pModal.value.openModal();
      } else if (status === "edit") {
        tempProduct.value = { ...item };
        isNew.value = false;
        pModal.value.openModal();
      } else if (status === "delete") {
        tempProduct.value = { ...item };
        if (!Array.isArray(tempProduct.value.imagesUrl)) {
          tempProduct.value.imagesUrl = [];
        }
        isNew.value = false;
        dModal.value.openModal();
      }
    }
    async function getProducts(page = 1) {
      //給參數預設值
      try {
        const getUrl = `${url}/api/${path}/admin/products?page=${page}`; //(query)為網址參數寫法，page參數帶入，取得當前頁碼的產品資料
        const { data } = await axios.get(getUrl);
        products.value = data.products;
        pagination.value = data.pagination;
      } catch (error) {
        alert(error.response.data.message);
        console.log(error);
        window.location = "login.html";
      }
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
          pModal.value.closeModal();
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
          dModal.value.closeModal();
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
    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      checkLogin();
    });
    return {
      isNew,
      products,
      tempProduct,
      pagination,
      checkLogin,
      openModal,
      getProducts,
      updateProduct,
      delProduct,
      createImages,
      pModal,
      dModal,
    };
  },
  components: {
    //components要加s，因為可能有很多個子元件
    paginationComponent,
    productModalComponent,
    deleteModalComponent,
  },
});
app.mount("#app");
