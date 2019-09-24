<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加书单</span>
            </div>
            <div class="text item">
                <el-form :model="form" ref="form" status-icon label-width="120px" class="demo-ruleForm">
                    <el-form-item label="书单名" style="width:445px;">
                        <el-input type="text" v-model="form.name" placeholder="请输入书单名" maxlength=10></el-input>    
                    </el-form-item>
                    <el-form-item label="书单封面" style="width:455px;">
                        <el-input type="text" v-model="form.image" placeholder="请输入封面地址"></el-input>
                    </el-form-item>
                     <el-form-item label="书单封面色" style="width:445px;">
                        <el-input type="text" v-model="form.color" placeholder="请输入书单封面色" style="width:280px;position: relative;top: -13px;"></el-input>
                        <el-color-picker v-model="form.color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="优先级" style="width:445px;">
                        <el-input type="number" v-model="form.sort" placeholder="请输入书单优先级"></el-input>    
                    </el-form-item>
                    <el-form-item label="状态" style="width:445px;">
                        <el-select v-model="form.state" placeholder="请选择书单状态" style="width:325px">
                            <el-option label="上架" value="1"></el-option>
                            <el-option label="下架" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期" style="width:445px;">
                        <el-date-picker v-model="form.expirationDate" type="datetime" placeholder="选择日期时间" default-time="12:00:00"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="详情" style="width:445px;">
                        <el-input type="textarea" maxlength=50 :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入详情" v-model="form.intro"></el-input>
                    </el-form-item>
                    <el-button type="primary" size="medium" @click="addCollection()" style="margin-left:30px;">立即添加</el-button>
                </el-form>
            </div>
        </el-card>
        <el-table :data="collection" border style="width: 100%" >
            <el-table-column prop="id"      label="书单id"></el-table-column>
            <el-table-column prop="name"    label="书单名" style="white-space: nowrap;  text-overflow:ellipsis;  overflow:hidden;"></el-table-column>
            <el-table-column prop="intro"   label="简介" width="180" style="white-space: nowrap;  text-overflow:ellipsis;  overflow:hidden;"></el-table-column>
            <el-table-column prop="intro"   label="封面" width="100" height="100">
                <template slot-scope="scope">
                    <img :src="scope.row.backgroundImage" alt="" width="70px" height="100px"/>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="优先级"></el-table-column>
            <el-table-column prop="backgroundColor" label="背景色"></el-table-column>
            <el-table-column prop="state" label="状态">
                <template slot-scope="scope">
                    <el-button type="success" v-show="scope.row.state==1" size="small" @click="updateState(scope.row.id,false)">已上架</el-button>
                    <el-button type="danger"  v-show="scope.row.state==0" size="small" @click="updateState(scope.row.id,true) ">已下架</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogTableVisible = true, index = scope.row.id, queryBooks()">查看</el-button>
                    <el-dialog title="书籍列表" :visible.sync="dialogTableVisible" :modal-append-to-body="false" v-if="index==scope.row.id" :before-close="handleClose">
                        <el-table :data="books" border style="width:100%;">
                            <el-table-column property="id" label="id" min-width="80"></el-table-column>
                            <el-table-column property="name" label="书籍名" min-width="80"></el-table-column>
                            <el-table-column property="cover" label="封面" min-width="80">
                                <template slot-scope="scope">
                                    <img :src="scope.row.cover" width="80" height="100"/>
                                </template>
                            </el-table-column>
                            <el-table-column property="author" label="作者" min-width="80"></el-table-column>
                            <el-table-column property="applaudsTotal" label="点赞总数" min-width="80"></el-table-column>
                            <el-table-column property="comment" label="评语" min-width="80"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-button type="text" @click="update(scope.row)" > 修改 </el-button>
                    <el-dialog title="修改书单信息" :visible.sync="dialogFormVisible" v-if="updateForm.id==scope.row.id">
                        <el-form :model="updateForm" ref="updateForm" status-icon label-width="120px" class="demo-ruleForm">
                            <el-form-item label="书单名" style="width:445px;"> 
                                <el-input type="text" v-model="updateForm.name" placeholder="请输入书单名"></el-input>    
                            </el-form-item>
                            <el-form-item label="书单封面" style="width:455px;">
                                <el-input type="text" v-model="updateForm.image" placeholder="请输入封面地址"></el-input>
                            </el-form-item>
                            <el-form-item label="书单封面色" style="width:445px;">
                                <el-input type="text" v-model="updateForm.color" placeholder="请输入书单封面色" style="width:280px;position: relative;top: -13px;"></el-input>
                                <el-color-picker v-model="updateForm.color"></el-color-picker>
                            </el-form-item>
                            <el-form-item label="优先级" style="width:445px;">
                                <el-input type="number" v-model="updateForm.sort" placeholder="请输入书单优先级"></el-input>    
                            </el-form-item>
                            <el-form-item label="日期" style="width:445px;">
                                <el-date-picker v-model="updateForm.expirationDate" type="datetime" placeholder="选择日期时间" default-time="12:00:00"> </el-date-picker>
                            </el-form-item>
                            <el-form-item label="详情" style="width:445px;">
                                <el-input type="textarea" v-model="updateForm.intro" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入详情"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="updateCollection()">确 定</el-button>
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
    name :'collection',
    data(){
        return {
            collection:[],
            books:[],
            page:{
                pageSize:[5, 10, 20, 30, 40, 50],
                page:1,
                size:5,
                total:0
            },
            form:{
                name: '',
                intro: '',
                image: '',
                color: '#000000',
                sort: 0,
                state: '请输入选择一个值',
                expirationDate:''
            },
            updateForm:{
                id:-1,
                name: '',
                intro: '',
                image: '',
                color: '',
                sort: 0,
                state: '请输入选择一个值',
                expirationDate:''
            },
            sort:0,
            dialogTableVisible:false,
            dialogFormVisible:false,
            index:-1
        }   
    },
    methods:{
        query(){
            this.axios.get('/manage/collection?sort=sort&page='+this.page.page+'&size='+this.page.size).then((res)=>{
                console.info(res.data);
                this.page.total=res.data.data.total;
                this.collection=res.data.data.list;
                console.info(this.collection);
            }).catch((res)=>{
                console.info(res);
                this.$message.error('请求超时');
            })
        },
		handleClose(done){
			console.info('触发了');
			this.books=null;
			done();
		},
        queryBooks(){
            this.axios.get("/manage/collection/"+this.index).then((res)=>{
                if(res.data.code==1008){
					console.info('请来了');
					this.$message('查询成功，但没有数据');
					return;
                }
                console.info(res.data);
				this.books=res.data.data.list;
            }).catch((res) =>{
                console.info(res);
            })
        },
        addCollection(){
            this.form.state=this.form.state==1?true:false;
			this.form.expirationDate=this.form.expirationDate.getTime();
            console.info(this.form);
            this.axios.post("/manage/collection",this.form).then((res)=>{
                console.info(res);
                this.form={
                    name: '',
                    intro: '',
                    image: '',
                    color: '#000000',
                    sort: '',
                    state: '请输入选择一个值',
                    expirationDate:''
                };
            }).catch((res) =>{
                console.info(res);
            })
        },
        update(data){
            this.dialogFormVisible  = true;
            this.updateForm=data;
            this.updateForm.image=data.backgroundImage;
            this.updateForm.color=data.backgroundColor;
        },
        updateCollection(){
            console.info("调用了");
            this.updateForm.state=this.updateForm.state==1?true:false;
            this.updateForm.expirationDate=new Date(this.updateForm.expirationDate).getTime();
            this.axios.put("/manage/collection",this.updateForm).then((res)=>{
                console.info(res);
                this.query();
                this.dialogFormVisible=false;
            }).catch((res) =>{
                console.info(res);
            })
        },
        updateState(id,state){
            console.info(id,state);
            this.axios.put("/manage/collection/id?id="+id+"&state="+state).then((res)=>{
                this.query();
                console.info(res);
            }).catch((res) =>{
                console.info(res);
            })
        },
        handleSizeChange(val) {
            this.page.size=val;
            this.query();
        },
        handleCurrentChange(val) {
            this.page.page=val;
            this.query();
        },
        
    },
    created(){
        this.axios.get('/manage/collection?page='+this.page.page+'&size='+this.page.size).then((res)=>{
            console.info(res.data);
            this.page.total=res.data.data.total;
            this.collection=res.data.data.list;
            console.info(this.collection);
        }).catch((res)=>{
            console.info(res);
            this.$message.error('请求超时');
        })
    }
}
</script>
<style scoped>
</style>

