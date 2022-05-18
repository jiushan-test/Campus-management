<script>
export default {
  created() {
    const { params, query } = this.$route
    console.log(this.$route)
    const { path } = params
    // console.log(params, query)
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
