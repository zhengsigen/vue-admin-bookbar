<template>
  <div class="common">
    <el-card>
      <template slot="header">查询</template>
      <el-form :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.name" style="width:40%"></el-input>
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

    <template>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="用户id"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column label="头像">
          <template #default="{row}">
            <img style="width:34px;height:34px;border-radius: 99px; " :src="row.cover | cover" />
          </template>
        </el-table-column>
        <el-table-column label="余额">
          <template #default="{row}">{{row.balance | numeral}}</template>
        </el-table-column>
        <el-table-column prop="addrId" label="地址id"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.enabled==0">冻结</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #default="{row}">{{row.createDate | moment}}</template>
        </el-table-column>
        <el-table-column label="最近登录时间">
          <template #default="{row}">{{row.loginDate | moment}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="state(scope.row.id)"
              size="mini"
              plain
            >
              <span v-if="scope.row.enabled==0">解冻结</span>
              <span v-else>冻结</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block" style="background: #fff;padding: 32px 16px;">
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
  </div>
</template>

<script>
const USERURL = "/manage/user?name=";
export default {
  name: "common",
  data() {
    return {
      page: {
        size: 5,
        index: 1,
        total: 0
      },
      searchForm: {},
      users: []
    };
  },
  methods: {
    handleSizeChange() {
      this.getUsers();
    },
    handleCurrentChange() {
      this.getUsers();
    },
    getVal(val) {
      return val === undefined ? "" : val === null ? "" : val;
    },
    getUsers() {
      this.$http
        .get(
          USERURL +
            this.getVal(this.searchForm.name) +
            "&minDate=" +
            this.getVal(this.searchForm.beginDate) +
            "&maxDate=" +
            this.getVal(this.searchForm.endDate) +
            "&pageSize=" +
            this.page.size +
            "&pageNum=" +
            this.page.index
        )
        .then(res => {
          this.users = res.data.data.list;
          this.page.total = res.data.data.total;
        })
        .catch(response => {
          console.info(response);
        });
    },
    inquire() {
      this.page.index = 1;
      this.$http
        .get(
          USERURL +
            this.getVal(this.searchForm.name) +
            "&minDate=" +
            this.getVal(this.searchForm.beginDate) +
            "&maxDate=" +
            this.getVal(this.searchForm.endDate) +
            "&pageSize=" +
            this.page.size +
            "&pageNum=" +
            this.page.index
        )
        .then(response => {
          this.users = response.data.data.list;
          this.page.total = response.data.data.total;
        });
    },
    state(id) {
      console.info(id);
      this.axios
        .put("/manage/user/" + id)
        .then(response => {
          this.getUsers();
          console.info(response);
        })
        .catch(response => {
          console.info(response);
          this.$message.error("请求超时");
        });
    }
  },
  computed: {},
  created() {
    this.$http
      .get(
        USERURL + "&pageSize=" + this.page.size + "&pageNum=" + this.page.index
      )
      .then(res => {
        console.info(res.data.data);
        this.users = res.data.data.list;
        this.page.total = res.data.data.total;
      })
      .catch(response => {
        console.info(response);
      });
  },
  filters: {
    cover: val => {
      return val === null ? "img/default_avatar.png" : val;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/scss/order.scss";
</style>