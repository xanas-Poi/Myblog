<template>
  <div id="createCategory">
    <el-form
      :model="ruleForm2"
      status-icon
      :rules="rules2"
      ref="ruleForm2"
      label-width="0px"
      class="demo-ruleForm"
    >
      <h2>创建分类</h2>
      <el-form-item prop="name">
        <el-input v-model="ruleForm2.name" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item prop="key">
        <el-input v-model="ruleForm2.key" placeholder="分类关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')"
          >创建</el-button
        >
        <el-button type="danger" @click="resetForm('ruleForm2')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入分类名"));
      }
      callback();
    };
    return {
      ruleForm2: {
        name: "",
        key: ""
      },
      rules2: {
        name: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions({
      createCategory: "category/create"
    }),

    // 创建
    async _createCategory() {
      this.ruleForm2.id = this.id;
      try {
        await this.createCategory(this.ruleForm2);
        this.$message({
          showClose: true,
          message: "创建成功",
          type: "success"
        });
        this.$router.push("/admin/category/list");
      } catch (e) {
        console.log(e);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._createCategory();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
#createCategory {
  margin: 10% 0 0 35.3%;
  & h2 {
    padding: 10px;
    color: black;
    font-size: 20px;
    margin-left: 14%;
  }
  & .el-form {
    & .el-input {
      width: 40%;
    }
    & .el-button {
      padding: 10px 5%;
    }
    & .el-button--primary {
      background-color: #ffd04e;
      color: black;
      margin: 0 auto;
    }
    & .el-button--danger {
      background-color: white;
      color: black;
      border: 1px solid black;
    }
  }
}
</style>
