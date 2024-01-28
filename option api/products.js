import { createApp } from "vue";

let productModal = null;
let deleteProductModal = null;
//因為有其他元件也會使用到，因此將url相關資訊寫在全域
const url = "https://ec-course-api.hexschool.io/v2";
const path = "hsuanin-vue2024";

createApp({
  data() {
    return {
      isNew:false,
      products:[],
      tempProduct:{
        imagesUrl:[],
      },
      pagination:{},
    };
  },
  methods: {
    checkLogin(params) {
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
    },
    openModal(status,item){
      console.log(item);
      if(status === 'new'){
        this.tempProduct = {
          imagesUrl:[],
        };
        this.isNew = true;
        productModal.show();
      }else if(status === 'edit'){
        this.tempProduct = {...item};
        this.isNew = false;
        productModal.show();
      }else if(status === 'delete'){
        this.tempProduct = {...item};
        this.isNew = false;
        deleteProductModal.show();
      }
    },
    getProducts(page = 1) { //給參數預設值
      const getUrl = `${url}/api/${path}/admin/products?page=${page}`; //為網址參數寫法，page參數帶入，取得當前頁碼的產品資料
      axios
        .get(getUrl)
        .then((res) => {
          console.log(res.data);
          const {products, pagination} = res.data;
          this.products = products;
          this.pagination = pagination;
          console.log(this.products);
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.log(error);
          window.location = 'login.html';
        });
    },
    updateProduct(){
      let updateOrNewUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
      let http = 'put';
      if(this.isNew){
        updateOrNewUrl = `${url}/api/${path}/admin/product`;
        http = 'post';
      }
      axios[http](updateOrNewUrl,{data:this.tempProduct})
      .then((res)=>{
        alert(res.data.message);
        productModal.hide();
        this.getProducts();//取得所有產品
      })
      .catch((error)=>{
        alert(error.response.data.message);
      })
    },
    delProduct(){
      const deleteUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
      axios.delete(deleteUrl)
      .then((res)=>{
        alert(res.data.message);
        deleteProductModal.hide();
        this.getProducts();//更新所有產品
      })
      .catch((error)=>{
        alert(error.response.data.message);
      })
    },
    createImages(){
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // console.log(token);
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
    productModal = new bootstrap.Modal(document.getElementById("productModal"),{
      keyboard : false,
      backdrop:'static'
    })
    deleteProductModal = new bootstrap.Modal(document.getElementById("delProductModal"),{
      keyboard : false,
      backdrop:'static'
    })
  },
}).component('pagination',{ //分頁元件
  template:`<nav aria-label="Page navigation example">
  <ul class="pagination">
      <li class="page-item" 
      :class="{disabled:pages.current_page === 1}"
      >
          <a class="page-link" href="#" aria-label="Previous"
          @click.prevent = "changePage(pages.current_page - 1)">
              <span aria-hidden="true">&laquo;</span>
          </a>
      </li>
      <li class="page-item" 
      v-for="(item,index) in pages.total_pages"
      :key="index"
      :class="{'active': item === pages.current_page}">
          <a class="page-link" href="#"
          @click.prevent = "changePage(item)">
              {{item}}
          </a>
      </li>
      <li class="page-item">
          <a class="page-link" href="#" aria-label="Next"
          @click.prevent = "changePage(pages.current_page + 1)">
              <span aria-hidden="true">&raquo;</span>
          </a>
      </li>
  </ul>
</nav>`,
  props:['pages'],
  data(){
    return{

    };
  },
  methods:{
    changePage(num){
      this.$emit('change-page',num)
    }
  },
}).mount('#app');
