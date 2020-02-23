<template>
    <div class="manage">
        管理中心
    </div>
</template>
<script>
import {User,Common} from '@/request/api.js'
export default {
    data(){
        return{

        }
    },
    created(){
      this.queryCompanyTree()  
    },
    methods:{
        /**
         * 3.7.2 查询账户管理的公司树
         */
        queryCompanyTree(){
            Common({
                FAction:'QuerySuperAdminAgentTree'
            })
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                
            });
        }
    }
}
</script>
<style lang='scss'>
.manage{
    height: 100%;
    color: #666666;
}
</style>