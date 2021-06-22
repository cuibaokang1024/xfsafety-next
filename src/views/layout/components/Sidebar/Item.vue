<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render (h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<i style='color: #fff;' class={icon}></i>)
    }

    if (title) {
      vnodes.push(
        <span slot='title'>
          <el-tooltip effect='dark' content={title} placement='right-start'>
            <span>{(title)}</span>
          </el-tooltip>
        </span>
      )
    }
    return vnodes
  }
}
</script>
<style lang="scss" scoped>

</style>
