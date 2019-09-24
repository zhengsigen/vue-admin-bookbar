<template>
  <div>
    <el-card>
      <template slot="header">查询</template>
      <el-form :model="searchForm" class="search-form" ref="searchForm">
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
      <el-button type="primary" icon="el-icon-edit" @click="formUser={}">添加</el-button>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="用户id" width="180"></el-table-column>
        <el-table-column prop="name" label="用户名" width="180"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column label="头像">
          <template #default="{row}">
            <img style="width:34px;height:34px;border-radius: 99px; " src="img/20150415H2854_XURW3.jpeg" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="{row}">{{row.createDate | moment}}</template>
        </el-table-column>
        <el-table-column label="最近登录时间">
          <template #default="{row}">{{row.loginDate | moment}}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{row}">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editMode(row)"
              size="mini"
              plain
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="remove(row.id)"
              size="mini"
              plain
            >删除</el-button>
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

    <el-dialog
      v-if="formUser"
      :title="formUser.id ? '编辑': '添加'"
      @close="formUser = null"
      :visible="true"
      :before-close="handleClose"
      center
    >
      <el-form :model="formUser" :rules="formRules" ref="formUser">
        <el-input name="userName" style="position:fixed;bottom:-9999px;"></el-input>
        <el-input type="password" style="position:fixed;bottom:-9999px;"></el-input>
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="formUser.name"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="formUser.password" show-password></el-input>
        </el-form-item>
        <el-form-item :label="formUser.id ? '确认修改密码：': '确认密码：'" prop="affirmPassword">
          <el-input v-model="formUser.affirmPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="头像：" prop="cover">
          <el-upload
            class="avatar-uploader"
            action="http://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handlerCover"
          >
            <img v-if="formUser.cover" :src="formUser.cover" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formUser = null" plain>取消</el-button>
        <el-button type="primary" @click="upUser" plain>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const ADMINURL = "/manage/admin/";
export default {
  name: "management",
  data() {
    var password = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formUser.affirmPassword !== "") {
          this.$refs.formUser.validateField("affirmPassword");
        }
        callback();
      }
    };
    var affirmPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      page: {
        size: 5,
        index: 1,
        total: 0
      },
      formUser: null,
      searchForm: {},
      users: [],
      formRules: {
        name: [
          {
            required: true,
            message: "请填写用户名",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "用户名长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请填写密码",
            trigger: "blur",
            validator: password
          },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ],
        affirmPassword: [
          {
            required: true,
            validator: affirmPassword,
            message: "请填写密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ],
        cover: [
          {
            required: true,
            message: "请上传头像",
            trigger: "blur"
          },
          {
            min: 1,
            message: "请上传头像",
            trigger: "blur"
          }
        ]
      }
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
          ADMINURL+
          "?name=" +
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
    remove(id) {
      this.$confirm(`确认删除?`, "确认删除", {
        type: "danger"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          Axios.delete(ADMINURL + id).then(res => {
            this.getUsers();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    upUser() {
      this.$refs.formUser.validate(valid => {
        if (valid) {
          if (this.formUser.id) {
            Axios.put(ADMINURL, {
              id: this.formUser.id,
              name: this.formUser.name,
              password: this.formUser.password,
              cover: this.formUser.cover
            })
              .then(res => {
                this.formUser = null;
                this.getUsers();
              })
              .catch(err => {
                console.error(err);
              });
          } else {
            Axios.post(ADMINURL, {
              name: this.formUser.name,
              password: this.formUser.password,
              cover: this.formUser.cover
            })
              .then(res => {
                this.formUser = null;
                this.getUsers();
              })
              .catch(err => {
                console.error(err);
              });
          }
          this.formUser = null;
        } else {
          this.$message({
            message: "请按要求填写数据",
            type: "error"
          });
          return false;
        }
      });
    },
    handlerCover(res, file) {
      this.$set(this.formUser, "cover", URL.createObjectURL(file.raw));
    },
    editMode(row) {
      this.formUser = JSON.parse(JSON.stringify(row));
    },
    inquire() {
      this.page.index = 1;
      Axios.get(
        ADMINURL +
          "?name=" +
          this.getVal(this.searchForm.name) +
          "&minDate=" +
          this.getVal(this.searchForm.beginDate) +
          "&maxDate=" +
          this.getVal(this.searchForm.endDate) +
          "&pageSize=" +
          this.page.size +
          "&pageNum=" +
          this.page.index
      ).then(response => {
        this.users = response.data.data.list;
        this.page.total = response.data.data.total;
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  created() {
    this.$http
      .get(
        ADMINURL + "?pageSize=" + this.page.size + "&pageNum=" + this.page.index
      )
      .then(res => {
        this.users = res.data.data.list;
        this.page.total = res.data.data.total;
      })
      .catch(response => {
        console.info(response);
      });
  },
  computed: {}
};
</script>

<style lang="scss">
@import "@/styles/scss/management.scss";
@import "@/styles/scss/order.scss";
</style>
