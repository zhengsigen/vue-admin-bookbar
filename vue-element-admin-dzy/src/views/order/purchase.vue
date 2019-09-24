<template>
    <el-table :data="orders" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column prop="id" label="订单id" width="120"></el-table-column>
        <el-table-column label="用户名" width="120">
          <template #default="{row}">
            <span
              v-if="users.filter(u => u.id == row.userId).length>0"
            >{{users.filter(u => u.id == row.userId)[0].name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单信息地址" width="300">
          <template #default="{row}">
            姓名：{{row.userName}}
            <br />
            地址：{{row.province}}-{{row.city}}-{{row.district}}-{{row.street}}
            <br />
            联系方式：{{row.phone}}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="书名" width="200">
          <template #default="{row}">
            <div class="books">{{row.orderBooksConditions.map(o => o.name).join("，")}}</div>
          </template>
        </el-table-column>

        <!-- 标记:总价 -->
        <el-table-column prop="total" label="总价" sortable>
          <template #default="{row}">{{row.total | numeral}}</template>
        </el-table-column>

        <el-table-column label="状态">
          <template #default="{row}">
            <el-button
              :type="(row.status >= orderEnum.status )? 'danger' : statusClass[row.status]"
              @click="modificationType(row)"
              size="mini"
              plain
            >{{row.status >= orderEnum.status ? "订单取消":status[row.status]}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="订单类型">
          <template #default="{row}">
            <el-tag :type="typeClass[row.type]" effect="plain">{{ type[row.type]}}</el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column label="录入时间" prop="createTime" sortable>
          <template #default="{row}">{{ row.createTime | moment }}</template>
        </el-table-column>

        <!-- 修改时间 -->
        <el-table-column label="更新时间" prop="updateTime" sortable>
          <template #default="{row}">{{ row.updateTime | moment }}</template>
        </el-table-column>
      </el-table>
</template>
<script>
const orderEnum = {
  status: 10,
  getOrderBooks: 4,
  settlement: 5
};
export default {
    name: "purchase",
    data () {
        return {
            orderEnum,
            orders:[],
            users: [],
            statusClass: [
                "info",
                "warning",
                "success",
                "info",
                "warning",
                "success",
                ""
            ],
            status: [
                "待付款",
                "待发货",
                "运输途中",
                "运输途中",
                "已签收"
            ],
            type: ["卖书订单", "买书订单"],
            condition: ["良好", "中等", "不合格"],
            typeClass: ["", "success"],
        }
    },
    created () {
        this.upload();
    },
    methods: {
        async upload() {
            let data = await this.$http.get("/manage/order?pageSize=100");
            console.info(data.data.data);
            if(data.data.code == 0) {
                let orders = data.data.data.data;
                this.orders = orders.filter(order =>order.type);
            }
            let userData = await this.$http.get("/manage/user/list" +"?userId=" + this.orders.map(o => o.userId).join("&userId="));
            console.info(userData);
            if(userData.data.code == 0){
                this.users = userData.data.data;
            }
        },
        async modificationType(order){
            console.info(order.status);
            let status = order.status;
            if(status === 1 || status === 2){
                let data = await this.$http.put("/manage/order", {id: order.id,status: ++status})
                console.info(data);
                await this.upload();
            }
        }
    }

}
</script>
