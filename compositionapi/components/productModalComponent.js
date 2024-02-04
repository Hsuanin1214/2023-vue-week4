import {ref,onMounted,watch,} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
//會有refs bootstrap 問題]
export default {
  props: ["tempProduct", "updateProduct", "isNew"],
  setup(props) {
    const productModal = ref(null);
    // Step 1: 創建一個 ref 來保存 Bootstrap Modal 的實例
    const modalInstance = ref(null);
    const editProduct = ref({
      imagesUrl: [],
    });
    const openModal = () => {
      if (modalInstance.value) {
        modalInstance.value.show();
      }
    };
    const closeModal = () => {
      modalInstance.value.hide();
    };
    onMounted(() => {
      if (productModal.value) {
        modalInstance.value = new bootstrap.Modal(productModal.value);
      }
    });
		watch(
      () => props.tempProduct,
      (newVal) => {
        if (newVal && !newVal.imagesUrl) {
          newVal.imagesUrl = []; // 確保imagesUrl是一個陣列
        }
        editProduct.value = newVal;
      },
      { immediate: true } // 如果希望在監視開始時立即執行一次handler，則設置immediate為true
    );
    return {
      productModal,
      editProduct,
      openModal,
      closeModal,
    };
  },
  // composition api 需要將ref變成動態 :ref
  template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-xl">
		  <div class="modal-content border-0">
				  <div class="modal-header bg-dark text-white">
						  <h5 id="productModalLabel" class="modal-title">
								  <span v-if="isNew">新增產品</span>
								  <span v-else>編輯產品</span>
						  </h5>
						  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				  </div>
				  <div class="modal-body">
						  <div class="row">
								  <div class="col-sm-4">
										  <div class="mb-2">
										  <div class="mb-3">
														  <input type="text" class="form-control mb-2" placeholder="請輸入圖片連結"
																  v-model="editProduct.imageUrl">
												  </div>
												  <img class="img-fluid" :src="editProduct.imageUrl" alt="">
										  </div>
										  <h3 class="mb-3">多圖新增</h3>
										  <!-- 檢查是否為陣列 -->
										  <div v-if="Array.isArray(editProduct.imagesUrl)">
												  <div class="mb-1" v-for="(img,key) in editProduct.imagesUrl" :key="key + 123">
														  <div class="mb-3">
																  <input v-model="editProduct.imagesUrl[key]" type="text" class="form-control"
																		  placeholder="請輸入圖片連結">
														  </div>
														  <img class="img-fluid" :src="img" alt="">
												  </div>
										  </div>
										  <button
												  v-if="editProduct.imagesUrl.length == 0  || editProduct.imagesUrl[editProduct.imagesUrl.length - 1]"
												  class="btn btn-outline-primary btn-sm d-block w-100"
												  @click="editProduct.imagesUrl.push('')">
												  <!-- 最後一個有值的情況下 -->
												  新增
										  </button>
										  <!-- <div v-else> -->
										  <div v-else>
												  <button class="btn btn-outline-danger btn-sm d-block w-100"
														  @click="editProduct.imagesUrl.pop()">
														  刪除
												  </button>
										  </div>
								  </div>
								  <div class="col-sm-8">
										  <div class="mb-3">
												  <label for="title" class="form-label">標題</label>
												  <input id="title" type="text" class="form-control" placeholder="請輸入標題"
														  v-model="editProduct.title">
										  </div>

										  <div class="row">
												  <div class="mb-3 col-md-6">
														  <label for="category" class="form-label">分類</label>
														  <input id="category" type="text" class="form-control" placeholder="請輸入分類"
																  v-model="editProduct.category">
												  </div>
												  <div class="mb-3 col-md-6">
														  <label for="price" class="form-label">單位</label>
														  <input id="unit" type="text" class="form-control" placeholder="請輸入單位"
																  v-model="editProduct.unit">
												  </div>
										  </div>

										  <div class="row">
												  <div class="mb-3 col-md-6">
														  <label for="origin_price" class="form-label">原價</label>
														  <input id="origin_price" type="number" min="0" class="form-control"
																  placeholder="請輸入原價" v-model="editProduct.origin_price">
												  </div>
												  <div class="mb-3 col-md-6">
														  <label for="price" class="form-label">售價</label>
														  <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"
																  v-model="editProduct.price">
												  </div>
										  </div>
										  <hr>

										  <div class="mb-3">
												  <label for="description" class="form-label">產品描述</label>
												  <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述"
														  v-model="editProduct.description">
					  </textarea>
										  </div>
										  <div class="mb-3">
												  <label for="content" class="form-label">說明內容</label>
												  <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容"
														  v-model="editProduct.content">
					  </textarea>
										  </div>
										  <div class="mb-3">
												  <div class="form-check">
														  <input id="is_enabled" v-model="editProduct.is_enabled" class="form-check-input"
																  type="checkbox" :true-value="1" :false-value="0">
														  <label class="form-check-label" for="is_enabled">是否啟用</label>
												  </div>
										  </div>
								  </div>
						  </div>
				  </div>
				  <div class="modal-footer">
						  <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
								  取消
						  </button>
						  <button type="button" class="btn btn-primary" @click.prevent="updateProduct">
								  確認
						  </button>
				  </div>
		  </div>
  </div>
</div>`,
};
