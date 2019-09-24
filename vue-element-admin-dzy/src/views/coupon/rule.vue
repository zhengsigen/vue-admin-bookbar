<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h4 style="margin:10px;">添加优惠券</h4>
            </div>
            <div class="text item">
                <el-form :model="ruleForm" status-icon label-width="100px">
                    <el-form-item label="优惠券id" maxlength=10>
                        <el-input type="number" v-model="ruleForm.couponId" autocomplete="off" placeholder="请输入优惠券id" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="发送门槛">
                        <el-input type="number" v-model="ruleForm.sendCondition" autocomplete="off" placeholder="请输入发送门槛" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="发送数量">
                        <el-input type="number" v-model="ruleForm.count" autocomplete="off" placeholder="请输入数量" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" @click="addRule()">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-table :data="rule">
            <el-table-column prop="id" label="id" min-width="30"></el-table-column>
            <el-table-column prop="couponId" label="优惠券id" min-width="140"></el-table-column>
            <el-table-column prop="sendCondition" label="发送门槛" min-width="140"></el-table-column>
            <el-table-column prop="count" label="发送数量" min-width="140"></el-table-column>
            <el-table-column label="操作" min-width="240">
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogUpdateVisible = true, updateForm.id = scope.row.id">修改</el-button>
                    <el-dialog title="优惠券列表" :visible.sync="dialogUpdateVisible" :modal-append-to-body="false" v-if="updateForm.id==scope.row.id">
                        <el-form :model="updateForm" ref="updateForm" status-icon label-width="100px" class="demo-ruleForm">
                            <el-form-item label="发送门槛">
                                <el-input type="number" v-model="updateForm.sendCondition" placeholder="请输入发送门槛" max-width="300px"></el-input>
                            </el-form-item>
                            <el-form-item label="发送数量">
                                <el-input type="number" v-model="updateForm.count" placeholder="请输入发送数量" max-width="300px"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                                <el-button type="primary" @click="dialogUpdateVisible = false,updateRule()">确 定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-button type="text" @click="deleteRule(scope.row.id)">删除</el-button>
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
    name:"rule",
    data(){
        return {
            rule:[],
            page:{
                pageSize:[5, 10, 20, 30, 40, 50],
                page:1,
                size:5,
                total:0
            },
            ruleForm:{
                couponId:0,
                count:0,
                sendCondition:0.00
            },
            updateForm:{
                count:0,
                sendCondition:0.00
            },
            dialogUpdateVisible:false,
            index:-1
        }
    },
    methods:{
        handleSizeChange(val){
            this.page.size=val;
            this.queryRule();
        },
        handleCurrentChange(val){
            this.page.page=val;
            this.queryRule();
        },
        queryRule(){
            this.axios.get("/manage/coupon/rule?page="+this.page.page+"&size="+this.page.size).then( (res) =>{
                this.page.page=res.data.data.pageNum;
                this.page.size=res.data.data.pageSize;
                this.page.total=res.data.data.total;
                this.rule=res.data.data.list;
            }).catch((res)=>{
                console.info(res);
            })
        },
        addRule(){
            this.axios.post("/manage/coupon/rule",this.ruleForm).then( (res) =>{
                console.info(res);
                this.queryRule();
            }).catch((res) =>{
                console.info(res);
            })
        },
        updateRule(){
            console.info(this.updateForm);
            this.axios.put("/manage/coupon/rule",this.updateForm).then( (res) =>{
                console.info(res);
                this.queryRule();
            }).catch((res) =>{
                console.info(res);
            })
        },
        deleteRule(id){
            console.info(id);
            this.axios.delete("/manage/coupon/rule?id="+id).then((res) =>{
                console.info(res);
            }).catch((res) =>{
                console.info(res);
            })
        }
    },
    created(){
        this.axios.get("/manage/coupon/rule?page="+this.page.page+"&size="+this.page.size).then( (res) =>{
            this.page.page=res.data.data.pageNum;
            this.page.size=res.data.data.pageSize;
            this.page.total=res.data.data.total;
            this.rule=res.data.data.list;
            console.info(this.rule);
        }).catch((res)=>{
            console.info(res);
        })
    }
}
</script>