<template>
    <div class="my-pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          layout="prev, pager, next, total,jumper"
          :total="total">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    props:{
        pageIndex:{
            type:Number,
            default:1
        },
        pageSize:{
            default:15
        },
        total:{
            default:0,
            type:Number,
            required:true
        }
    },
    methods:{
        /**
         * handleCurrentChange 页码改变时触发
         */
        handleCurrentChange(val){
            this.$emit('pageIndexChange',val)
        }
    }

}
</script>
<style lang="scss">
.my-pagination{
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 40px;
/*     .el-pagination.is-background{
        .el-pager{
            li:not(.disabled).active{
                background: #15868C
            }
            li:not(.disabled):hover{
                background: #15868C
            }
        }
        
    } */
}

</style>