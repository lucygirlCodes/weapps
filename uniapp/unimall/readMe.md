#项目记录
**uni-app去掉h5端的导航栏**
1.  使用uniapp编译的H5代码默认是带导航条的（仿原生app的效果）
调试发现其导航条最终会被编译成一个 uni-page-head 标签：想要隐藏该导航条的话只需要在应用文件 App.vue 中的样式中添加公用css：
、、、
    /* #ifdef H5 */
    uni-page-head
    {
        display: none;
    }
    /* #endif */
、、、

2. 找到项目的根目录下的pages.json文件，在对应路径下添加一下内容，可以去掉对应页面的导航栏
找到项目的根目录下的pages.json文件，添加一下内容，可以去掉对应页面的导航栏

、、、
"app-plus":{
			"titleNView": false
		}
、、、

**首页兼容问题**
了解概念：沉浸式状态栏（原生app会存在这个问题） 解决：上面的第二条  外加css
、、、
// 条件编译 设置离顶部的高度
/*  #ifdef  APP-PLUS  */
top: var(--status-bar-height);
/*  #endif  */
、、、

**封装request**

**状态栏**
<page-status></page-status> 是为了解决 手机端滑动状态栏样式

#分类页面 记录
下拉刷新页面 重新加载（先清空之前数据 在重新加载数据 加载完后停止刷新） 需要在pagejson 配置 
"enablePullDownRefresh": true,
"onReachBottomDistance": 0

**详情页面 记录**
加入购物车 评论  存入本地存储

**购物车 记录**
子组件不能改变父组件的值  子组件通过this.$emit 传给组件 进而父组件进行修改值

