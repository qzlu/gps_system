/**
 * @param {Array} tableData 表格数据
 * @param {Number} total 表格数据总条数
 * @param {Number} pageIndex 页码
 */
import {pagination} from '@/components/index.js'
export default {
    data() {
        return {
            tableData: [],
            total: 0,
            pageIndex: 1,
            pageSize:15

        }
    },
    components: {
        pagination
    },
    methods: {
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val) {
            this.pageIndex = val
            this.queryData()
        },
        tableRowClassName({
            row,
            rowIndex
        }) {
            if (rowIndex % 2 === 1) {
                return 'odd-row';
            } else if (rowIndex % 2 === 0) {
                return 'even-row';
            }
        },
        beforeDelete(){
            return new Promise((resolve,reject) => {
                this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                      resolve()
                  }).catch(() => {
                      reject()
                  });
            })
        },
    },
}