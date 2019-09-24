<template>
    <div>
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询</span>
            </div>
            <div class="text item">
                <el-input type="text" v-model="book" autocomplete="off" placeholder="请输入书名" style="width:300px;"></el-input>
                <el-button type="primary" size="medium" @click="queryBooks()" style="margin-left:30px;">立即查询</el-button>
            </div>
        </el-card>

         <!-- <el-button @click="nameStatus(sort.nameStatus)">名字</el-button>
        <el-button @click="doubanStatus(sort.doubanRateStatus)" >豆瓣评分</el-button>
        <el-button @click="priceStatus(sort.priceStatus)">价格</el-button> -->

        <el-table :data="books" border :default-sort = "{prop: 'date', order: 'descending'}" @sort-change="handleSortChange">
            <el-table-column prop="id" label="id" min-width="40"  fixed="left"></el-table-column>
            
            <el-table-column prop="name" label="书籍名" min-width="120" sortable></el-table-column>
           
            <el-table-column prop="cover" label="封面" min-width="120">
                <template slot-scope="scope">
                    <img :src="scope.row.cover" min-width="50px" height="75px"/>
                </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" min-width="120"></el-table-column>
            
            <el-table-column prop="price" label="金额" min-width="120" sortable></el-table-column>
           
            <el-table-column prop="doubanRate" label="豆瓣评分" min-width="120" sortable></el-table-column>
            
            <el-table-column prop="stock" label="总库存" min-width="120"></el-table-column>
            <el-table-column prop="sale"  label="销量" min-width="120"></el-table-column>
            <el-table-column prop="publisher" label="出版社" min-width="120"></el-table-column>
            <el-table-column prop="binding" label="装帧" min-width="120"></el-table-column>
            <el-table-column label="介绍" min-width="120" style="height:50px;">
                <template slot-scope="scope">
                    <el-popover class="item" effect="dark"  placement="right-start" :title="scope.row.gist" width="120" trigger="hover">
                        <el-button slot="reference">详情</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="品相操作" min-width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="querySku(scope.row.id),dialogTableVisible = true,index=scope.$index">查看品相列表</el-button>
                    <el-dialog title="书籍列表" :visible.sync="dialogTableVisible" style="height:450px" :modal-append-to-body="false" :id="{'max':index==scope.$index}" v-if="index==scope.$index">
                        <el-table :data="skus" border style="min-width:100%;">
                            <el-table-column property="id" label="id" min-width="80"></el-table-column>
                            <el-table-column property="bookId" label="书籍id" min-width="80"></el-table-column>
                            <el-table-column property="discount" label="折扣" min-width="80">
                                <template slot-scope="scope">
                                    <div  @dblclick="open(scope.row.id,scope.row.bookId)" size="mini" type="info" :modal-append-to-body="false" >{{scope.row.discount}}</div>
                                </template>
                            </el-table-column>
                            
                            <el-table-column property="condition" label="品相" min-width="80">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.condition==0">良好</span>
                                    <span v-if="scope.row.condition==1">一般</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="stock"  label="库存" min-width="80"></el-table-column>
                            <el-table-column property="isFree" label="Free" min-width="120">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="info"      plain v-if="scope.row.isFree==false" @click="updateBooksFree(scope.row.id,scope.row.bookId,true)">未加入</el-button>
                                    <el-button size="mini" type="success"   plain v-if="scope.row.isFree==true" @click="updateBooksFree(scope.row.id,scope.row.bookId,false)">已加入</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" min-width="120">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="info"    plain v-if="scope.row.status==status.sold_out" @click="updateBookStatus(scope.row.id,scope.row.bookId,status.putaway)">已下架</el-button>
                                    <el-button size="mini" type="success" plain v-if="scope.row.status==status.putaway" @click="updateBookStatus(scope.row.id,scope.row.bookId,status.sold_out)">上架中</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="padding-top:5px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="page.page"
            :page-sizes="page.pageSize"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name :'stack_room',
    data(){
        return {
            book:'',
            books:[],
            skus :[],
            index:-1,
            sortField : {
                nameStatus : 1,
                doubanRateStatus : 2,
                priceStatus :3,
                totalStatus : 0,
            },
            page:{
                pageSize:[5, 10, 20, 30, 40, 50],
                page :1,
                size :5,
                total:1
            },
            discount:0,
            condition:{
                fine:0,
                ordinary:1
            },
            status:{
                sold_out:0,
                putaway:1
            },
            inputShow:false,
            dialogTableVisible:false
        }
    },
    methods:{
        // nameStatus(val){
        //     console.info(val)
        //     this.axios.get('/manage/book?pageSize='+
        //     this.page.size+'&pageNum='+
        //     this.page.page+
        //     "&nameStatus="+
        //     this.sort.nameStatus+
        //     "&totalStatus="+
        //     this.sort.totalStatus
        //     )
            
        //     .then((response)=>{
        //         if(this.sort.totalStatus == 1){
        //             this.sort.totalStatus = 0
        //         }else{
        //             this.sort.totalStatus = 1
        //         }
        //         var data = response.data.data;
        //         this.page.page   = data.pageNum;
        //         this.page.size   = data.pageSize;
        //         this.page.total  = data.total;
        //         this.books  = data.list;
        //     }).catch((response)=>{
        //         console.info(response);
        //         this.$message.error('请求超时');
        //     })
        // },

        //  doubanStatus(val){
        //       console.info(val)
        //     this.axios.get('/manage/book?pageSize='+
        //     this.page.size+'&pageNum='+
        //     this.page.page+
        //     "&doubanRateStatus="+
        //     this.sort.doubanRateStatus+
        //     "&totalStatus="+
        //     this.sort.totalStatus
        //     )
            
        //     .then((response)=>{
        //         if(this.sort.totalStatus == 1){
        //             this.sort.totalStatus = 0
        //         }else{
        //             this.sort.totalStatus = 1
        //         }
        //         var data = response.data.data;
        //         this.page.page   = data.pageNum;
        //         this.page.size   = data.pageSize;
        //         this.page.total  = data.total;
        //         this.books  = data.list;
        //     }).catch((response)=>{
        //         console.info(response);
        //         this.$message.error('请求超时');
        //     })
        // },
        // priceStatus(val){
        //      console.info(val)
        //     this.axios.get('/manage/book?pageSize='+
        //     this.page.size+'&pageNum='+
        //     this.page.page+
        //     "&priceStatus="+
        //     this.sort.priceStatus+
        //     "&totalStatus="+
        //     this.sort.totalStatus
        //     )
        //     .then((response)=>{
        //         if(this.sort.totalStatus == 1){
        //             this.sort.totalStatus = 0
        //         }else{
        //             this.sort.totalStatus = 1
        //         }
        //         var data = response.data.data;
        //         this.page.page   = data.pageNum;
        //         this.page.size   = data.pageSize;
        //         this.page.total  = data.total;
        //         this.books  = data.list;
        //     }).catch((response)=>{
        //         console.info(response);
        //         this.$message.error('请求超时');
        //     })

        // },

    //     async getOerderList() {
    //   await this.$http
    //     .get(
    //       ORDERURL +
    //         "?page=" +
    //         this.page.index +
    //         "&pageSize=" +
    //         this.page.size +
    //         "&name=" +
    //         this.getVal(this.searchForm.userName) +
    //         "&start=" +
    //         this.getVal(this.searchForm.beginDate) +
    //         "&end=" +
    //         this.getVal(this.searchForm.endDate)
    //          +
    //         "&totalPriceStatus="+
    //         this.sort.totalPriceStatus+
    //         "&totalStatus="+
    //         this.sort.totalStatus
            
    //     )
    //     .then(res => {
    //       this.orders = res.data.data;
    //       this.page.total = res.data.data.total;
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    //   await this.$http
    //     .get(
    //       "/manage/user/list" +
    //         "?userId=" +
    //         this.orders.data.map(o => o.userId).join("&userId=")
    //     )
    //     .then(res => {
    //       this.users = res.data.data;
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // },


        handleSortChange(val) {
            if(val.column){
                console.info(val.column)
                this.sortField.totalStatus = val.order == 'ascending'? 0 : 1

                console.info(val.prop)  //怎么拿到数字
                this.sortField.nameStatus = val.prop == 'name'? 1 : val.prop == 'doubanRate' ? 2 : val.prop == 'price' ? 3 : '' //
            }else{
                this.sortField.nameStatus = '';
                this.sortField.totalStatus = '';
            }
            this.queryBooks()
        },


        queryBooks(){
            this.axios.get('/manage/book?pageSize='
                +this.page.size+'&pageNum='
                +this.page.page+'&name='
                +this.book
                +"&nameStatus="+
                this.sortField.nameStatus+
                "&totalStatus="+
                this.sortField.totalStatus
               
            
            ).then((response)=>{
                //当前页数大于分类页数给他设置页数为1，重新发送一遍
                var data = response.data.data;
                if(this.page.page>data.pages && data.pages!=0){
                    this.page.page   = 1;
                    this.queryBooks();
                }
                this.page.total  = data.total;
                this.books  = data.list;
            }).catch((response)=>{
                console.info(response);
                this.$message.error('请求超时');
            })
        },
        querySku(index){
            console.info(index);
            this.axios.get('/manage/book/sku/'+index).then((response)=>{
                console.info(response.data.data);
                this.skus=response.data.data.skus;
            }).catch((response)=>{
                console.info(response);
                this.$message.error('<querySku>请求超时');
            })
        },
        updateBooksFree(id,booksId,free){
            this.axios.put('/manage/book',{
                id:id,
                isFree:free
            }).then((response)=>{
                this.querySku(booksId);
            }).catch((response)=>{
                console.info(response);
            })
        },
        updateBookStatus(id,booksId,status){
            this.axios.put('/manage/book',{
                id:id,
                status:status
            }).then((response)=>{
                this.querySku(booksId);
            }).catch((response)=>{
                console.info('失败');
                console.info(response);
            })
        },
        updateDiscount(id,bookId,discount){
            console.info('触发了',id,discount);
            this.axios.put('/manage/book',{
                id:id,
                discount:discount
            }).then((response)=>{
                this.querySku(bookId);
            }).catch((response)=>{
                console.info('失败');
                console.info(response);
            })
            this.inputShow=false;
        },
        handleSizeChange(val) {
            this.page.size=val;
            this.queryBooks();
        },
        handleCurrentChange(val) {
            this.page.page=val;
            this.queryBooks();
        },
        open(id,bookId) {
            console.info('触发了');
            this.$prompt('请输入折扣(保留俩位小数)', '修改折扣', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                inputPattern: /^(?=0\.[1-9]|[1-9]\.\d).{3}$|^([1-9])$/,
                inputErrorMessage: '请输入0.1-9.9之间的数字'
            }).then(({ value }) => {
                this.updateDiscount(id,bookId,value);
                this.$message({
                    type: 'success',
                    message: '修改成功，折扣为: ' + value
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消修改'
                });       
            });
        }
    },
    created(){
        // var url = document.URL;
        // console.info(url);
        // if(url.indexOf("?") != -1 ){
        //     console.info('有参数');
        // }else{
        //     console.info('无参数');
        // }
        this.axios.get('/manage/book')
        .then((response)=>{
            var data = response.data.data;
            this.page.total  = data.total;
            this.books  = data.list;
        }).catch((response)=>{
            console.info(response);
            this.$message.error('请求超时');
        })
    }
}
</script>
<style scoped>
    .red{
        color: rgb(245, 108, 108);
    }
    .grey{
        color: rgb(144, 147, 153);
    }
    #max{
        z-index:10000;
    }
</style>
