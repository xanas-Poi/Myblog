<template>
  <div class="commentslist">
    <el-table
      stripe
      :data="list"
      :row-style="{ height: '40px' }"
      :cell-style="{ padding: '5px' }"
      style="font-size: 12px"
    >
      <el-table-column label="ID" prop="id" width="80"> </el-table-column>
      <el-table-column label="昵称" prop="nickname"> </el-table-column>
      <el-table-column label="邮箱" prop="email"> </el-table-column>
      <el-table-column label="评论内容" prop="content" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="评论时间" prop="createdAt" width="200">
      </el-table-column>
      <el-table-column label="所属文章ID" prop="article_id" width="100">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{ row }">
          <el-button size="mini" type="danger" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handlePage"
      :current-page="currentPage"
      layout="prev, pager, next"
      :total="page.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import merge from "webpack-merge";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      currentPage: 1, //初始页
      list: [],
      page: {}
    };
  },
  created() {
    this._getCommentsList();
  },
  methods: {
    ...mapActions({
      getCommentsList: "comments/allList",
      destroyComments: "comments/destroy"
    }),

    // 获取评论
    async _getCommentsList() {
      const res = await this.getCommentsList({
        page: this.currentPage
      });
      this.list = res.data.data.data;
      this.page = res.data.data.meta;
    },
    // 切换分页
    handlePage(page) {
      this.$router.replace({
        query: merge(this.$route.query, {
          page
        })
      });
      this.currentPage = page;
      this._getCommentsList();
    },

    async handleDelete(id) {
      if (confirm("是否删除此评论？")) {
        await this.destroyComments(id);
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success"
        });
        this._getCommentsList();
      } else {
        console.log("取消");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.commentslist {
  margin: 2.5rem auto;
  & .el-table {
    border: 1px solid rgb(204, 204, 204);
  }
  & .el-pagination {
    text-align: center;
    margin-top: 5px;
  }

  & .el-button--danger {
    background-color: white;
    color: black;
    border: 1px solid black;
  }
}
</style>
