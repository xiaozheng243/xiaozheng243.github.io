<template>
  <div class="post_list">
    <div v-for="post in postList" v-if="post.title && pathCheck(post.path)" class="post_item">
      title:
      <a :href="post.path">{{post.title}}</a>
      <hr />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      postList: []
    };
  },
  created() {
    this.postList = this.$site.pages;
  },
  methods: {
    pathCheck(postPath) {
      let patter = /\/.*\//;
      return patter.test(postPath);
    }
  }
};
</script>
<style lang="css">
.post_list {
  width: 820px;
  margin: 0 auto;
}
.post_item {
  min-height: 200fr;
  border: solid 1;
}
</style>