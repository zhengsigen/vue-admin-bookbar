<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加运费模板</span>
            </div>
            <div class="text item">
                <el-form :model="freightForm" status-icon label-width="80px" class="demo-ruleForm">
                    <el-form-item label="城市" style="padding:6px;">
                        <el-input minlength="2" maxlength="8" type="text" v-model="freightForm.province" autocomplete="off" placeholder="请输入城市" style="max-width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="运费" style="padding:6px;">
                        <el-input minlength="2" maxlength="8" type="number" v-model="freightForm.charge" autocomplete="off" placeholder="请输入城市"  style="max-width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="包邮门槛" style="padding:6px;">
                        <el-input minlength="2" maxlength="8" type="number" v-model="freightForm.pinkage" autocomplete="off" placeholder="请输入城市"  style="max-width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="是否发货" style="padding:6px;">
                        <el-radio v-model="freightForm.shipments" label="true" border>发货</el-radio>
                        <el-radio v-model="freightForm.shipments" label="false" border>拒发</el-radio>
                    </el-form-item>
                    <el-button type="primary" size="medium" @click="add()" style="margin-left:30px;">立即添加</el-button>
                </el-form>
            </div>
        </el-card>
        <el-table :data="freight"  border>
            <el-table-column label="id" prop="id" width="40"></el-table-column>
            <el-table-column label="城市" prop="province" min-width="40"></el-table-column>
            <el-table-column label="费用" prop="charge" min-width="40"></el-table-column>
            <el-table-column label="包邮门槛" prop="pinkage" min-width="40"></el-table-column>
            <el-table-column label="是否发货" prop="shipments" min-width="40">
                <template slot-scope="scope">
                    <span v-if="scope.row.shipments">发货</span><span v-if="!scope.row.shipments">不发货</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createDate" min-width="40"></el-table-column>
            <el-table-column label="操作" min-width="40">
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogTableVisible = true, update(scope.row)">修改</el-button>
                    <el-dialog title="运费模板" :visible.sync="dialogTableVisible" :modal-append-to-body="false" v-if="updateForm.id==scope.row.id" :before-close="handleClose">
                        <el-form :model="updateForm" ref="updateForm" status-icon label-width="120px" class="demo-ruleForm">
                            <el-form-item label="城市" style="width:445px;"> 
                                {{updateForm.province}}
                            </el-form-item>
                            <el-form-item label="费用" max-width="455">
                                <el-input type="number" v-model="updateForm.charge"></el-input>
                            </el-form-item>
                            <el-form-item label="包邮门槛"  max-width="455">
                                <el-input type="number" v-model="updateForm.pinkage"></el-input>
                            </el-form-item>
                            <el-form-item label="是否发货"  max-width="455">
                                <el-radio v-model="updateForm.shipments" label="true" border>发货</el-radio>
                                <el-radio v-model="updateForm.shipments" label="false" border>拒发</el-radio>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="updateCoupon()">确 定</el-button>
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
    name:"freight",
    data(){
        return {
            freight:[],
            page:{
                pageSize:[5, 10, 20, 30, 40, 50],
                page:1,
                size:5,
                total:0
            },
            freightForm:{
                province:"",
                charge:0,
                pinkage:0,
                shipments:"true"
            },
            updateForm:{
                id:0,
                province:"",
                charge:0,
                pinkage:0,
                shipments:"发货"
            },
            dialogTableVisible:false
        }
    },
    methods:{
        query(){
            this.axios.get('/manage/freight?page='+this.page.page+'&size='+this.page.size).then((res)=>{
                console.info(res.data);
                this.freight=res.data.data.list;
                this.page.size = res.data.data.pageSize;
                this.page.page = res.data.data.pageNum;
                this.page.total= res.data.data.total;
            }).catch((res)=>{
                console.info(res);
                this.$message.error('请求超时');
            });
        },
        update(data){
            this.updateForm=data;
            this.updateForm.shipments=data.shipments+"";
            console.info(this.updateForm);
        },
        updateCoupon(){
            this.dialogTableVisible = false;
			console.info(this.updateForm);
            this.axios.put("/manage/freight",this.updateForm).then((res) =>{
                console.info(res);
                this.query();
            }).catch((res) =>{
                console.info(res);
            })
        },
        add(){
            console.info(this.freightForm);
            this.axios.post("/manage/freight",this.freightForm).then((res) =>{
                console.info(res);
            }).catch((res) =>{
                console.info(res);
            })
        },
        handleSizeChange(val){
            this.page.size=val;
            this.query();
        },
        handleCurrentChange(val){
            this.page.page=val;
            this.query();
        }
    },
    created(){
        this.axios.get('/manage/freight?page='+this.page.page+'&size='+this.page.size).then((res)=>{
            this.freight=res.data.data.list;
            this.page.size = res.data.data.pageSize;
            this.page.page = res.data.data.pageNum;
            this.page.total= res.data.data.total;
        }).catch((res)=>{
            console.info(res);
            this.$message.error('请求超时');
        });
    }
}
</script>

<style lang="scss" scoped>

</style>