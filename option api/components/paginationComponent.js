//1.先把元件環境建立好
//2.把版型ˊ加入
//3.解除版型內的錯誤
export default {
  data() {
    return {};
  },
  props: ['pages','getProducts'],
  template:
	  `<nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" 
            :class="{disabled:pages.current_page === 1}"
            >
                <a class="page-link" href="#" aria-label="Previous"
                @click.prevent = "getProducts(pages.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" 
            v-for="(item,index) in pages.total_pages"
            :key="index + 123"
            :class="{'active': item === pages.current_page}">
                <a class="page-link" href="#"
                @click.prevent = "getProducts(item)">
                    {{item}}
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next"
                @click.prevent = "getProducts(pages.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>`,
  methods: {
    changePage(num) {
      this.$emit("change-page", num);
    },
  },
};
