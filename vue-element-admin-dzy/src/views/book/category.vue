<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加分类</span>
            </div>
            <div class="text item">
                <el-form :model="form" :rules="rules" ref="form" status-icon label-width="40px" class="demo-ruleForm">
                    <el-form-item prop="category" style="padding:6px;">
                        <el-input minlength="2" maxlength="8" type="text" v-model="form.category" autocomplete="off" placeholder="请输入分类名" style="width:300px;"></el-input>
                        <el-button type="primary" size="medium" @click="addCategory()" style="margin-left:30px;">立即添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>查询分类</span>
            </div>
            <div class="text item" style="margin-left:40px;">
                <el-input v-model="condition" minlength="2" maxlength="8" type="text" placeholder="请输入分类名" style="width:300px;"></el-input>
                <el-button type="primary" size="medium" @click="queryCategory()" style="margin-left:30px;">立即查询</el-button>
            </div>
        </el-card>
        <el-table :data="bookCategory" border style="width: 100%" height="330" >
            <el-table-column prop="id" label="分类id" min-width="180"></el-table-column>
            <el-table-column prop="name" label="分类名" min-width="180"></el-table-column>
            <el-table-column prop="bookLength" label="分类书籍总量" min-width="180"></el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogBookTableVisible = true, index = scope.row.id, queryNoInCategoryBook()">添加</el-button>
                    <el-dialog title="添加分类书籍" :visible.sync="dialogBookTableVisible" :modal-append-to-body="false" v-if="index==scope.row.id">
                         <el-transfer
                            v-model="InBooks"
                            :props="{key: 'id',label: 'name'}"
                            :titles="['未加入', '已加入']"
                            :data="noInBooks"
                            @change="handleChange"
                        ></el-transfer>
                    </el-dialog>
                    <el-button type="text" @click="deleteCategory(scope.row.id)">删除</el-button>
                    <el-button type="text" @click="dialogFormVisible  = true, index = scope.$index, updateName = scope.row.name" > 修改 </el-button>
                    <el-button type="text" @click="dialogTableVisible = true, index = scope.row.id, queryBooks()">查看</el-button>
                    <el-dialog title="书籍列表" :visible.sync="dialogTableVisible" :modal-append-to-body="false" v-if="index==scope.row.id">
                        <el-table :data="books" border style="width:100%;">
                            <el-table-column property="id" label="id" min-width="80"></el-table-column>
                            <el-table-column property="name" label="书籍名" min-width="80" style="white-space: nowrap;  text-overflow:ellipsis;  overflow:hidden;"></el-table-column>
                            <el-table-column property="cover" label="封面" min-width="80">
                                <template slot-scope="scope">
                                    <img :src="scope.row.cover" width="80" height="100"/>
                                </template>
                            </el-table-column>
                            <el-table-column property="author" label="作者" min-width="80"></el-table-column>
                        </el-table>
                    </el-dialog>
                    
                    <el-dialog title="修改分类名" :visible.sync="dialogFormVisible" v-if="index==scope.$index">
                        <el-form>
                            <el-form-item label="分类名">
                                <el-input v-model="updateName" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="updateCategory()">确 定</el-button>
                        </div>
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
    data(){
        var checkCategory = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('输入为空'));
            }
            setTimeout(() => {
                if (!Number.isNaN(Number(value))) {
                    callback(new Error('请不要全输入数字'));
                } else if(value.replace(/\s+/g,"").length<2){
                    callback(new Error('请输入俩位或以上的分类名'));
                }else{
                    callback();
                }
            }, 1000);
        };
        return{
            form:{
                category : ''
            },
            rules: {
                category: [
                    { validator: checkCategory, trigger: ['blur', 'change'] }
                ]
            },
            books:[],
            noInBooks:[],
            InBooks:[],
            bookCategory:[],
            condition:'',
            dialogBookTableVisible:false,
            dialogFormVisible: false,
            dialogTableVisible:false,
            updateName:'',
            index:-1,
            page:{
                pageSize:[5, 10, 20, 30, 40, 50],
                page:1,
                size:5,
                total:0
            }
        }
    },
    methods:{
        queryCategory(){
            this.axios.get('/manage/category?page='+this.page.page+'&pageSize='+this.page.size+'&name='+this.condition).then((response)=>{
                //当前页数大于分类页数给他设置页数为1，重新发送一遍
                var data = response.data.data;
                if(this.page.page>data.pages && data.pages!=0){
                    this.page.page   = 1;
                    this.queryCategory();
                }
                this.bookCategory=data.data;
                this.page.total = data.total;
                
            }).catch((response)=>{
                console.info(response);
                this.$message.error('请求超时');
            })
        },
        queryBooks(){
            if(this.index!=-1){
                this.axios.get('/manage/category/'+this.index).then((response)=>{
                    this.books = response.data.data.books;
                }).catch((response)=>{
                    console.info(response);
                })
            }
        },
        queryNoInCategoryBook(){
            this.queryCategory();
            this.axios.get('/manage/book/sku').then((response)=>{
                var books=response.data.data;
                this.noInBooks= [];
                books.map( x =>
                    this.noInBooks.push({
                        id:x.id,
                        name:x.name
                    })
                );
            }).catch((response)=>{
                console.info(response);
            })
            this.axios.get('/manage/category/'+this.index).then((response)=>{
                var books = response.data.data.books;
                this.InBooks=[];
                books.map( x =>
                    this.InBooks.push(x.id)
                );
            }).catch((response)=>{
                console.info(response);
            })
        },
        addCategory(){
            console.info(this.form.category);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.axios.post('/manage/category',{ name:this.form.category})
                    .then((response)=>{
                        console.info('发送成功');
                        this.queryCategory();
                        
                    }).catch((response)=>{
                        alert('超时请重试！')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleChange(value, direction, movedKeys) {
            var books = [];
            movedKeys.map(x => books.push( {id : x} ) );
            if(direction === "right") {
                this.axios.post('/manage/category/book',{
                    id: this.index, 
                    books: books
                }).then((response)=>{
                    console.info(response);
                    this.queryCategory();
                }).catch((repsonse)=>{
                    console.info(response);
                })
            }
            if(direction === "left") {
                var url = '/manage/category?categoryId='+this.index;
                movedKeys.map( x => url+=('&bookId='+x) );
                this.axios.delete(url)
                .then((response)=>{
                    console.info(response);
                    this.queryCategory();
                }).catch((repsonse)=>{
                    console.info(response);
                })
            }
        },
        updateCategory(){
            this.dialogFormVisible = false;
            this.axios.put('/manage/category',{
                 id:this.bookCategory[this.index].id,
                 name:this.updateName
             })
            .then((response)=>{
                console.info('成功');
                this.queryCategory();
            }).catch((response)=>{
                console.info('bug');
                console.info(response);
            })
            this.updateName='';
            // console.info(this.axios);
        },
        deleteCategory(id){
            this.axios.delete('/manage/category/?id='+id)
            .then((response)=>{
                console.info('成功');
                this.queryCategory();
            }).catch(function (error) {
                console.log(error);
            });
        },
        handleSizeChange(val) {
            this.page.size=val;
            this.queryCategory();
        },
        handleCurrentChange(val) {
            this.page.page=val;
            this.queryCategory();
        }
    },
    created(){
        this.axios.get('/manage/category?page='+this.page.page+'&pageSize='+this.page.size).then((response)=>{
            this.bookCategory=response.data.data.data;
            this.page.total = response.data.data.total;
        }).catch((response)=>{
            console.info(response);
            this.$message.error('请求超时');
        })
    }
}
</script>
<style scoped>
</style>

