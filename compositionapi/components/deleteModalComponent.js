import { ref, onMounted } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
export default {
  props: ["delProduct"],
  setup(props) {
    const delProductModal = ref(null);
    const openModal = () => {
      delProductModal.value.show();
    };
    // 替代原有的 methods
    const closeModal = () => {
      delProductModal.value.hide();
    };
    // 替代原有的 mounted 生命週期鉤子
    onMounted(() => {
      if (delProductModal.value) {
        const modalElement = delProductModal.value;
        delProductModal.value = new bootstrap.Modal(modalElement);
      }
    });
    return {
      delProductModal,
      openModal,
      closeModal,
    };
  },
  // composition api 需要將ref變成動態 :ref
  template: `<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 id="delProductModalLabel" class="modal-title">
                    <span>刪除產品</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                是否刪除
                <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    取消
                </button>
                <button type="button" class="btn btn-danger" @click="delProduct">
                    確認刪除
                </button>
            </div>
        </div>
    </div>
</div>`,
};
