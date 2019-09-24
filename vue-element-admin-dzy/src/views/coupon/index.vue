<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h4 style="margin:10px;">添加优惠券</h4>
            </div>
            <div class="text item">
                <el-form :model="couponForm" ref="couponForm" status-icon label-width="100px" class="demo-ruleForm">
                    <el-form-item label="券名" maxlength=10>
                        <el-input minlength="2" maxlength="8" type="text" v-model="couponForm.name" autocomplete="off" placeholder="请输入分类名" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-radio v-model="couponForm.type" label="false" border>运费券</el-radio>
                        <el-radio v-model="couponForm.type" label="true"  border>邀请券</el-radio>
                    </el-form-item>
                    <el-form-item label="劵面值">
                        <el-input minlength="2" maxlength="8" type="number" v-model="couponForm.amount" autocomplete="off" placeholder="请输入劵面值" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="使用门槛">
                        <el-input minlength="2" maxlength="8" type="number" v-model="couponForm.perLimit" autocomplete="off" placeholder="请输入使用门槛" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期(天)">
                        <el-input minlength="2" maxlength="8" type="number" v-model="couponForm.expiresIn" autocomplete="off" placeholder="请输入有效期(天)" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" @click="addCoupon()">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>    
        <!-- <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h4 style="margin:10px;">发送优惠券</h4>
            </div>
            <div class="text item">
                <el-form :model="sendForm" ref="sendForm" status-icon label-width="100px" class="demo-ruleForm">
                    <el-form-item label="id" maxlength=10>
                        <el-input type="number" v-model="sendForm.couponID" placeholder="请输入优惠券id" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="用户id">
                        <el-input type="number" v-model="sendForm.userID" placeholder="请输入用户id" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="text" v-model="sendForm.remark" placeholder="请输入发券备注" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" @click="sendCoupon()">立即发送</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>     -->
        <el-table :data="coupon" >
            <el-table-column prop="id" label="id" min-width="30"></el-table-column>
            <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
            <el-table-column prop="type" label="类型" min-width="140">
                <template slot-scope="scope">
                    <span v-if="!scope.row.type">邀请劵</span>
                    <span v-if="scope.row.type">运费劵</span>
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="劵面值" min-width="140"></el-table-column>
            <el-table-column prop="perLimit" label="使用门槛" min-width="140"></el-table-column>
            <el-table-column prop="expiresIn" label="有效期(天)" min-width="140"></el-table-column>
            <el-table-column prop="createDate" label="创建日期" min-width="140"></el-table-column>
            <el-table-column label="操作" min-width="240">
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogTableVisible = true, index = scope.row.id, queryCouponByID()">查看</el-button>
                    <el-dialog title="优惠券列表" :visible.sync="dialogTableVisible" :modal-append-to-body="false" v-if="index==scope.row.id">
                        <el-table :data="couponList" border style="width:100%;">
                            <el-table-column property="id" label="id" min-width="80"></el-table-column>
                            <el-table-column property="name" label="姓名" min-width="80">
                                <template slot-scope="scope">
                                    {{scope.row.wxName||scope.row.name}}
                                </template>
                            </el-table-column>
                            <el-table-column property="cover" label="用户头像" min-width="80">
                                <template slot-scope="scope">
                                    <img :src="scope.row.cover" width="80" height="100"/>
                                </template>
                            </el-table-column>
                            <el-table-column property="remark" label="描述" min-width="80"></el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-button type="text" @click="index = scope.row.id,updateExpiresIn()">修改有效期</el-button>
                    <div v-if="scope.row.type">
                        <el-button type="text" @click="dialogSendVisible = true, sendForm.couponID = scope.row.id">发券</el-button>
                        <el-dialog title="发送优惠券" :visible.sync="dialogSendVisible" :modal-append-to-body="false" v-if="sendForm.couponID==scope.row.id">
                            <el-form :model="sendForm" ref="sendForm" status-icon label-width="100px" class="demo-ruleForm">
                                <!--<el-form-item label="用户id">
                                    <el-input type="number" v-model="sendForm.userID" placeholder="请输入用户id" style="width:300px;"></el-input>
                                </el-form-item>-->
                                <el-form-item label="用户名">
                                    <el-input type="text" v-model="sendForm.name" placeholder="请输入用户名" style="width:300px;"></el-input>
                                </el-form-item>
                                <el-form-item label="备注">
                                    <el-input type="text" v-model="sendForm.remark" placeholder="请输入发券备注" style="width:300px;"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="dialogSendVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="dialogSendVisible = false,dialogUserVisible = true,  index = scope.row.id, open()">确 定</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                        <el-dialog title="选择用户" :visible.sync="dialogUserVisible" :modal-append-to-body="false" v-if="sendForm.couponID==scope.row.id&&index == scope.row.id">
                            <el-form :model="sendForm" ref="sendForm" status-icon label-width="100px" class="demo-ruleForm">
                                <el-form-item>
                                    <!--<el-dropdown :model="sendForm.userID">
                                        <span class="el-dropdown-link">
                                            选择用户id<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click="sendForm.userID=item.id">{{item.id}}{{item.wx_name||item.name}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>-->
                                    <el-select v-model="sendForm.userID" placeholder="选择用户id">
                                        <el-option :label="item.id" v-for="(item,index) in list" :key="index" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="dialogUserVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="dialogUserVisible = false,sendCoupon()">确 定</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </div>
                </template>
            </el-table-column>
        </el-table>    
        <div class="block" style="padding:5px;">
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
    name:"coupon",
    data(){
        return{
            coupon:[],
            couponList:[],
            couponForm:{
                name:"",
                type:"",
                amount:"",
                perLimit:"",
                expiresIn:0
            },
            sendForm:{
                userID:-1,
                remark:""
            },
            dialogSendVisible:false,
            dialogTableVisible:false,
            dialogUserVisible:false,
            index:-1,
            page:{
                pageSize:[5, 10, 20, 30, 40, 50],
                page:1,
                size:5,
                total:0
            },
            list:[],
            sendCouponID:"选择用户id"
        }
    },
    methods:{
        addCoupon(){
            console.info(this.couponForm);
            this.axios.post("/manage/coupon",this.couponForm).then((res)=>{
                console.info(res);
            }).catch((res)=>{
                console.info(res);
            })
        },
        open(){
            this.axios.get("/manage/user/list/"+this.sendForm.name).then((res) =>{
                this.list = res.data.data;
                this.sendForm.userID=this.list[0].id;
            }).catch((res)=>{
                console.info(res);
            });
            // var name = null;
            // this.axios.get("manage/user/"+this.sendForm.userID).then((res) =>{
            //     var data = res.data.data;
            //     if(data == null){
            //         this.$message({
            //             type: 'error',
            //             message: '这个用户不存在'
            //         });
            //         return;
            //     }else {
            //         name = data.user.wxName||data.user.name;
            //         this.$confirm('用户名为 ' + name+' 是否发券', '是否发券', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'info'
            //         }).then(() => {
            //             this.axios.post("/manage/coupon/send",this.sendForm).then((res)=>{
            //                 console.info(res);
            //                 this.$message({
            //                     type: 'success',
            //                     message: '已发券!'
            //                 });
            //             }).catch((res)=>{
            //                 console.info(res);
            //             })
            //         }).catch(() => {
            //             this.$message({
            //                 type: 'info',
            //                 message: '已取消'
            //             });          
            //         });
            //     }
            // })
        },
        sendCoupon(){
            console.info("======================="+this.sendForm.userID);
            console.info(this.sendForm);
            this.axios.post("/manage/coupon/send",this.sendForm).then((res)=>{
                console.info(res);
                this.$message({
                    type: 'success',
                    message: '已发券!'
                });
            }).catch((res)=>{
                console.info(res);
            })
        },
        queryCoupon(){
            this.axios.get("/manage/coupon?page="+this.page.page+"&size="+this.page.size).then((res)=>{
                this.page.size = res.data.data.pageSize;
                this.page.page = res.data.data.pageNum;
                this.page.total= res.data.data.total;
                this.coupon=res.data.data.list;
                console.info(this.coupon);
            })
            .catch((res)=>{
                console.info(res);
            })
        },
        queryCouponByID(){
            this.axios.get("/manage/coupon/"+this.index)
            .then((res)=>{
                this.couponList=res.data.data;
                console.info(res.data.data);
                if(this.couponList.length==0){
                     this.$message('这种优惠券还没有给用户发送过，快去发几张试试！');        
                }
            })
            .catch((res)=>{
                console.info(res);
            })
        },
        handleSizeChange(val){
            console.info(val);
            this.page.size=val;
            console.info(this.page.size);
            this.queryCoupon();
        },
        handleCurrentChange(val){
            console.info(this.page.page);
            this.page.page=val;
            console.info(this.page.page);
            this.queryCoupon();
        },
        updateExpiresIn(){
            this.$prompt('请输入有效期', '修改', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                this.axios.put("/manage/coupon?id="+this.index+"&expiresIn="+value).then((res)=>{
                    this.queryCoupon();
                    console.info(res);
                }).catch((res) =>{
                    console.info(res);
                })
            }).catch(() => {
                this.$message({ type: 'info',message: '取消输入' });
            });
        }
    },
    created(){
        this.axios.get("/manage/coupon?page="+this.page.page+"&size="+this.page.size).then((res)=>{
            this.page.size = res.data.data.pageSize;
            this.page.page = res.data.data.pageNum;
            this.page.total= res.data.data.total;
            this.coupon=res.data.data.list;
            console.info(this.coupon);
        }).catch((res)=>{
            console.info(res);
        })
    }
}
</script>
<style lang="scss">

</style>