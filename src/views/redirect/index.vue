<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    console.log(path, query)
    this.$router.replace({ path: '/' + path, query })
    console.log(this.$router)
  },
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
