<template>
  <div class="order">
    <el-card>
      <template slot="header">查询</template>
      <el-form :model="searchForm" class="search-form" ref="searchForm">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.userName" style="width:40%" @keyup.enter.native="inquire"></el-input>
        </el-form-item>
        <el-form-item label="时间区域">
          <el-col :span="5">
            <el-date-picker
              type="date"
              format="yyyy-MM-dd"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="searchForm.beginDate"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col :span="1">-</el-col>
          <el-col :span="5">
            <el-date-picker
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="searchForm.endDate"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="inquire">查询</el-button>
      </el-form>
    </el-card>

    <!-- <el-button @click="TotalStatus()">价格</el-button>
    <el-button @click="createStatus()">创建时间</el-button>
    <el-button @click="updateStatus()">修改时间</el-button> -->

    <div v-if="search !== null">{{search}}</div>
    <template v-else>
      <el-table :data="orders.data" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" @sort-change="handleSortChange">
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
            <template v-if="row.type">
              <el-button
                :type="(row.status >= orderEnum.status )? 'danger' : statusClass[row.status]"
                @click="modificationType(row)"
                size="mini"
                plain
              >{{row.status >= orderEnum.status ? "订单取消":buyStatus[row.status]}}</el-button>
            </template>
            <template v-else>
              <el-button
                v-if="row.status === orderEnum.getOrderBooks"
                :type="statusClass[row.status]"
                @click="getOrderBooks(row)"
                size="mini"
                plain
              >{{status[row.status]}}</el-button>
              <div v-else-if="row.status === orderEnum.settlement">
                <el-button
                  :type="statusClass[row.status]"
                  @click="settlement(row)"
                  size="mini"
                  plain
                >{{status[row.status]}}</el-button>
                <el-button @click="cancellationOfOrder(row.id)" size="mini" plain>取消订单</el-button>
              </div>
              <el-button
                v-else
                :type="(row.status >= orderEnum.status )? 'danger' : statusClass[row.status]"
                @click="modificationType(row)"
                size="mini"
                plain
              >{{row.status >= orderEnum.status ? "取消订单":status[row.status]}}</el-button>
            </template>
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
    <div class="block" style="background: #fff;padding: 32px 16px;" v-if="search === null">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.index"
        :page-sizes="[5, 10, 20, 50, 100, 300, 400]"
        :page-size.sync="page.size"
        :total="page.total"
        layout="total,prev, pager, next, jumper,sizes"
      ></el-pagination>
    </div>

    <el-dialog v-if="books" @close="books = null" width="100%" :visible="true" center>
      <el-table :data="books" style="width: 100%">
        <el-table-column prop="id" label="书籍id"></el-table-column>
        <el-table-column prop="name" label="书名"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="binding" label="装帧"></el-table-column>
        <el-table-column label="封面" width="75">
          <template #default="{row}">
            <img style="width:68px;height:95px" :src="row.cover" />
          </template>
        </el-table-column>
        <el-table-column prop="doubanRate" label="豆瓣评分"></el-table-column>
        <el-table-column prop="price" label="价值"></el-table-column>
        <el-table-column label="出版时间">
          <template #default="{row}">{{row.pubDate | moment}}</template>
        </el-table-column>
        <el-table-column prop="publisher" label="出版社"></el-table-column>
        <el-table-column prop="isbn10" label="isbn10"></el-table-column>
        <el-table-column prop="isbn13" label="isbn13" width="130"></el-table-column>
        <el-table-column label="品相" width="130">
          <template #default="{row}">
            <el-dropdown @command="handleCommand(row.id,$event)">
              <span class="el-dropdown-link">
                {{ row.condition === null ? "选择品相":condition[row.condition] }}
                <i
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">良好</el-dropdown-item>
                <el-dropdown-item command="1">中等</el-dropdown-item>
                <el-dropdown-item command="2">不合格</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="books = null" plain>取消</el-button>
        <el-button type="primary" @click="upBooks" plain>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { async } from "q";
const ORDERURL = "/manage/order/";
const orderEnum = {
  status: 10,
  getOrderBooks: 4,
  settlement: 5
};
export default {
  name: "order",
  data() {
    return {
      orderEnum,
      page: {
        size: 5,
        index: 1,
        total: 0
      },
      status: [
        "下单成功",
        "审核通过",
        "已取件",
        "运输途中",
        "已签收",
        "校对完成",
        "已结算"
      ],
      buyStatus: [
        "待付款",
        "待发货",
        "运输途中",
        "运输途中",
        "已签收"
    ],
      statusClass: [
        "info",
        "warning",
        "success",
        "info",
        "warning",
        "success",
        ""
      ],
      sort: {
        totalPriceStatus: 1,
        createTimeStatus: 2,
        updateTimeStatus: 3,
        totalStatus: 1
      },
      type: ["卖书订单", "买书订单"],
      typeClass: ["", "success"],
      condition: ["良好", "中等", "不合格"],
      searchForm: {},
      orders: [],
      users: [],
      books: null,
      currentStatus: null,
      closeBooks: null,
      search: null
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.getOerderList();
    },
    handleSizeChange(val) {
      this.getOerderList();
    },
    getVal(val) {
      return val === undefined ? "" : val === null ? "" : val;
    },
    async getOerderList() {
      await this.$http
        .get(
          ORDERURL +
            "?page=" +
            this.page.index +
            "&pageSize=" +
            this.page.size +
            "&name=" +
            this.getVal(this.searchForm.userName) +
            "&start=" +
            this.getVal(this.searchForm.beginDate) +
            "&end=" +
            this.getVal(this.searchForm.endDate)
             +
            "&totalPriceStatus="+
            this.sort.totalPriceStatus+
            "&totalStatus="+
            this.sort.totalStatus
            
        )
        .then(res => {
          this.orders = res.data.data;
          this.page.total = res.data.data.total;
        })
        .catch(err => {
          console.error(err);
        });
      await this.$http
        .get(
          "/manage/user/list" +
            "?userId=" +
            this.orders.data.map(o => o.userId).join("&userId=")
        )
        .then(res => {
          this.users = res.data.data;
        })
        .catch(err => {
          console.error(err);
        });
    },

    handleCommand(id, command) {
      this.books
        .filter(b => b.id === id)
        .forEach(b => {
          b.condition = command;
        });
    },
    cancellationOfOrder(id) {
      this.$confirm("是否确定取消订单?", "提示", {
        confirmButtonText: "确认取消",
        cancelButtonText: "不取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put(ORDERURL, { id: id, status: 10 })
            .then(res => {
              this.getOerderList();
            })
            .catch(err => {
              console.error(err);
            });
          this.$message({
            type: "success",
            message: "取消订单!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "不取消订单"
          });
        });
    },
    modificationType(order) {
      let newOrder = JSON.parse(JSON.stringify(order));
      if (newOrder.status >= 6) return;
      if(newOrder.type === 1 && newOrder.status >=4){
        return;
      }
      this.$http
        .put(ORDERURL, {
          id: newOrder.id,
          status: ++newOrder.status
        })
        .then(res => {
          this.getOerderList();
        })
        .catch(err => {
          console.error(err);
        });
    },
    inquire() {
      this.page.index = 1;
      this.$http
        .get(
          ORDERURL +
            "?name=" +
            this.getVal(this.searchForm.userName) +
            "&start=" +
            this.getVal(this.searchForm.beginDate) +
            "&end=" +
            this.getVal(this.searchForm.endDate) +
            "&page=" +
            this.page.index +
            "&pageSize=" +
            this.page.size
            // +
            // "&totalPriceStatus="+
            // this.sort.totalPriceStatus+
            // "&totalStatus="+
            // this.sort.totalStatus
        )
        .then(response => {
          if (response.data.data === null)
            return (this.search =
              "没有搜索的用户名：" + this.searchForm.userName);
          this.orders = response.data.data;
          this.page.total = response.data.data.total;
          this.$http
            .get(
              "/manage/user/list" +
                "?userId=" +
                this.orders.data.map(o => o.userId).join("&userId=")
            )
            .then(res => {
              this.users = res.data.data;
            })
            .catch(err => {
              console.error(err);
            });
        });
    },
    getOrderBooks(orders) {
      this.$http
        .get(ORDERURL + orders.id)
        .then(res => {
          this.currentStatus = {
            id: orders.id,
            userId: orders.userId
          };
          this.books = res.data.data.orderBooksConditions;
        })
        .catch(err => {
          console.error(err);
        });
    },
    upBooks() {
      let bookLength = this.books.filter(b => b.condition !== null).length;
      if (this.books.length !== bookLength) return;

      let orderBookRecords = [];
      this.books.forEach(b =>
        orderBookRecords.push({
          userId: this.currentStatus.userId,
          orderId: this.currentStatus.id,
          bookId: b.id,
          condition: Number(b.condition)
        })
      );

      this.$http
        .put(
          ORDERURL + "proofread",
          JSON.parse(JSON.stringify(orderBookRecords))
        )
        .then(res => {
          this.books = null;
          this.currentStatus = null;
          this.$http
            .get(
              ORDERURL +
                "?page=" +
                this.page.index +
                "&pageSize=" +
                this.page.size
            )
            .then(res => {
              this.orders = res.data.data;
            })
            .catch(response => {
              console.info(response);
            });
        })
        .catch(err => {
          console.error(err);
        });
    },
    settlement(orders) {
      this.$confirm("是否结算?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get(ORDERURL + orders.id)
            .then(res => {
              this.currentStatus = {
                id: orders.id,
                userId: orders.userId
              };
              this.closeBooks = res.data.data.orderBooksConditions;

              let orderBookRecords = [];
              this.closeBooks.forEach(b =>
                orderBookRecords.push({
                  userId: this.currentStatus.userId,
                  orderId: this.currentStatus.id,
                  bookId: b.id,
                  condition: Number(b.condition)
                })
              );

              this.$http
                .put(
                  ORDERURL + "settlement",
                  JSON.parse(JSON.stringify(orderBookRecords))
                )
                .then(res => {
                  this.closeBooks = null;
                  this.currentStatus = null;
                  this.getOerderList();
                })
                .catch(err => {
                  console.error(err);
                });
            })
            .catch(err => {
              console.error(err);
            });
          this.$message({
            type: "success",
            message: "结算成功!"
            
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消结算"
          });
        });
    },
    handleSortChange(val) {
        if(val.column){
          this.sort.totalStatus = val.order == 'ascending'? 0 : 1
          console.info(val.prop)
          this.sort.totalPriceStatus = val.prop == 'total'? 1 : val.prop == 'createTime' ? 2 : val.prop == 'updateTime' ? 3 : ''  
        }else{
          this.sort.totalPriceStatus = '';
          this.sort.totalStatus = '';
        }
        this.getOerderList()
      }
  },
  computed: {},
  async created() {
    await this.$http
      .get(
        ORDERURL + "?page=" + this.page.index + "&pageSize=" + this.page.size
            // +
            // "&totalPriceStatus="+
            // this.sort.totalPriceStatus+
            // "&totalStatus="+
            // this.sort.totalStatus
      )
      .then(res => {
        this.page.total = res.data.data.total;
        this.orders = res.data.data;
      })
      .catch(err => {
        console.error(err);
      });
    await this.$http
      .get(
        "/manage/user/list" +
          "?userId=" +
          this.orders.data.map(o => o.userId).join("&userId=")
      )
      .then(res => {
        this.users = res.data.data;
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/scss/order.scss";
</style>
