export default {
  data() {
    return {};
  },
  props: ["pages"],
  template:
	  `<nav aria-label="Page navigation example">
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
  methods: {
    changePage(num) {
      this.$emit("change-page", num);
    },
  },
};
