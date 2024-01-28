import { createApp,ref,onMounted } from "vue";
const createAppVue = createApp;

//modal 需要放在全域
let productModal = null;
let deleteProductModal = null;

const app = createAppVue({
  setup() {
    const url = ref("https://ec-course-api.hexschool.io/v2");
    const path = ref("hsuanin-vue2024");
    const products = ref([]);
    const isNew = ref(false);
    const tempProduct = ref({
      imagesUrl:[],
    })

    function checkLogin(params) {
      axios
        .post(`${url.value}/api/user/check`)
        //成功的結果
        .then((res) => {
          console.log(res);
          getProduct();
        })
        //失敗結果
        .catch((error) => {
          console.dir(error); //用dir可以展開資訊
          alert("未登入");
          window.location = "login.html";
        });
    }
    function getProduct() {
      axios
        .get(`${url.value}/api/${path.value}/admin/products`)
        .then((res) => {
          console.log(res.data);
          products.value = res.data.products;
          console.log(products.value);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    function openModal(status,product){
      console.log(product)
      if(status === 'new'){
        tempProduct.value = {
          imagesUrl:[],
        }
        isNew.value = true;
        productModal.show();
      }else if(status === 'edit'){
        tempProduct.value = {...product};
        isNew.value = false;
        productModal.show();
      }else if(status === 'delete'){
        tempProduct.value = {...product};
        isNew.value = false;
        deleteProductModal.show();
      }
    }
    function updateProduct(){
      let updateOrNewUrl = `${url.value}/api/${path.value}/admin/product/${tempProduct.value.id}`; //更新的api，需要id才知道要更新哪個
      let http = 'put';//axios 使用的方法
      if(isNew.value){
        updateOrNewUrl = `${url.value}/api/${path.value}/admin/product`;//新增api
        http = 'post';//axios 使用的方法
      }
      axios[http](updateOrNewUrl,{data:tempProduct.value})
      .then((res)=>{
        alert(res.data.message);
        productModal.hide();//關閉更新視窗
        getProduct();//重新渲染
      })
      .catch((error)=>{
        alert(error.response.data.message);
      })
    }
    function createImages(){
      tempProduct.imagesUrl = [];//清空imagesUrl
      tempProduct.imagesUrl.push('');//新增imagesUrl
    }
    function delProduct(){
      let deleteUrl = `${url.value}/api/${path.value}/admin/product/${tempProduct.value.id}`; //刪除的api，需要id才知道要更新哪個
      axios.delete(deleteUrl)
      .then((res)=>{
        alert(res.data.message);
        deleteProductModal.hide();//關閉更新視窗
        getProduct();//重新渲染
      })
      .catch((error)=>{
        alert(error.response.data.message);
      })
    }
    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      // console.log(token);
      axios.defaults.headers.common["Authorization"] = token;
      checkLogin();
      //創建modal實例，可以手動寫開關
      productModal = new bootstrap.Modal(document.getElementById("productModal"),{
        keyboard:false,
        backdrop:'static'
      });
      deleteProductModal = new bootstrap.Modal(document.getElementById("delProductModal"),{
        keyboard:false,
        backdrop:'static'
      })
    })
    return {
      url,path,products,isNew,tempProduct,checkLogin,getProduct,openModal,updateProduct,createImages,delProduct
    };
  }
})
app.mount("#app");
