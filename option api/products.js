import { createApp } from "vue";

let productModal = null;
let deleteProductModal = null;

createApp({
  data() {
    return {
      url: "https://ec-course-api.hexschool.io/v2",
      path: "hsuanin-vue2024",
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
      console.log(this.url);
      axios
        .post(`${this.url}/api/user/check`)
        //成功的結果
        .then((res) => {
          console.log(res);
          this.getProduct();
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
    getProduct(page=1) {
      axios
        .get(`${this.url}/api/${this.path}/admin/products?page=${page}`)
        .then((res) => {
          console.log(res.data);
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          console.log(this.products);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateProduct(){
      let updateOrNewUrl = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      let http = 'put';
      if(this.isNew){
        updateOrNewUrl = `${this.url}/api/${this.path}/admin/product`;
        http = 'post';
      }
      axios[http](updateOrNewUrl,{data:this.tempProduct})
      .then((res)=>{
        alert(res.data.message);
        productModal.hide();
        this.getProduct();//取得所有產品
      })
      .catch((error)=>{
        alert(error.response.data.message);
      })
    },
    delProduct(){
      const deleteUrl = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      axios.delete(deleteUrl)
      .then((res)=>{
        alert(res.data.message);
        deleteProductModal.hide();
        this.getProduct();//更新所有產品
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
})

app.component('pagination',{
  template:`<p>{{pages}}</p>`,
  props:['pages'],
  data(){
    return{

    };
  },
  methods:{

  },
})

app.mount('#app');
