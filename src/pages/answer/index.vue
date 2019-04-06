<template>
    <div>
      <i-modal :visible="visible "@ok="handleClose" :show-cancel="false">
        <view>使用当前账号名字登录</view>
      </i-modal>
      <i-modal :visible="backHome "@ok="backHomeFn" :show-cancel="false">
        <view>对手退出了当前房间请点击确定返回</view>
      </i-modal>
      <i-modal :visible="topicSatisfy "@ok="backHomeFn" :show-cancel="false">
        <view>所有题目已经回答完成了</view>
      </i-modal>
      <i-toast id="toast" />
      <i-row>
        <i-col span="6" i-class="col-class">
          <div>
            {{myName}}
          </div>
        </i-col>
        <i-col span="12" i-class="col-class">
          <div>
            <div>{{topics.title}}</div>
            <div>
              <div class="select-list" v-for="(item, index) in  topics.select" :key="index" @click="selected(index)">
                <i-icon v-if="allAnswer[userId] == index" class="my-selected" :type="allAnswer[userId] == topics.answer ? 'right': 'close'" />
                {{item}}
                <i-icon v-if="allAnswer[otherUserId] == index" class="user-selected" :type="allAnswer[otherUserId] == topics.answer ? 'right': 'close'" />
              </div>
            </div>
          </div>
        </i-col>
        <i-col span="6" i-class="col-class">
          {{userName}}
        </i-col>
      </i-row>
    </div>
</template>

<script>
  const { $Toast } = require('../../../static/iview/base/index')
  export default {
    data () {
      return {
        visible: true,
        homeName: '',
        myName: '',
        userName: '',
        topics: {},
        userId: '', // 当前用户id
        otherUserId: '',
        topicSize: 0, // 所有题目的总数
        backHome: false, // 用户退出时弹出提示
        topicIndex: 1, // 当前题目index
        topicSatisfy: false, // 题目完成提示
        isClick: true, // 当前用户是否可以再次选择
        allAnswer: {} // 所有用户的答案
      }
    },
    methods: {
      handleClose () {
        this.visible = false
        $Toast({
          content: '正在匹配用户',
          type: 'loading',
          duration: 0
        })
        let that = this
        wx.getStorage({
          key: 'id',
          success (res) {
            let id = res.data
            that.userId = id
            wx.getStorage({
              key: 'userName',
              success (res) {
                let name = res.data
                that.myName = name
                wx.connectSocket({
                  url: `wss://www.feilong.fun?name=${name}&id=${id}`,
                  success () {
                  }
                })
              }
            })
          }
        })
      },
      selected (index) {
        if (this.isClick) {
          this.isClick = false
          wx.sendSocketMessage({
            data: JSON.stringify({
              homeName: this.homeName,
              selected: index,
              id: this.userId
            })
          })
        }
      },
      getTopic (size = 1) {
        this.$http('/api/getTopic', 'GET', {size: size}, (res) => {
          this.topics = res.data
          this.topicSize = res.data.topicSize
          this.isClick = true
        })
      },
      backHomeFn () {
        wx.redirectTo({
          url: '/pages/index/main'
        })
      }
    },
    mounted () {
      wx.onSocketMessage(data => {
        let {homeList, homeName, answer, usersId, close} = JSON.parse(data.data)
        if (close) {
          this.backHome = true
          return false
        }
        console.log(JSON.parse(data.data))
        this.userName = homeList[homeList.indexOf(this.myName) + 1] ? homeList[homeList.indexOf(this.myName) + 1] : homeList[homeList.indexOf(this.myName) - 1]
        this.homeName = homeName
        let num = this.userId.toString()
        this.otherUserId = usersId[usersId.indexOf(num) + 1] ? usersId[usersId.indexOf(num) + 1] : usersId[usersId.indexOf(num) - 1]
        console.log('111', this.otherUserId, this.userId)
        if (homeList.length === 2) {
          $Toast.hide()
          if (JSON.stringify(answer) === '{}') {
            this.getTopic()
          } else {
            console.log('6666', answer)
            this.allAnswer = answer
            if (Object.keys(this.allAnswer).length === 2) {
              this.topicIndex += 1
              if (this.topicIndex > this.topicSize) {
                this.topicSatisfy = true
                return false
              }
              setTimeout(() => {
                this.allAnswer = {}
                this.getTopic(this.topicIndex)
              }, 300)
            }
          }
        }
      })
    },
    onUnload () {
      wx.closeSocket({code: 1000, reason: this.homeName})
      this.visible = true
      this.homeName = ''
      this.myName = ''
      this.userName = ''
      this.allAnswer = {}
      this.topicIndex = 1
      this.isClick = true
      this.backHome = false
      this.topicSatisfy = false
      this.topics = {}
    }
  }
</script>

<style scoped>
  .select-list{
    width: 100%;
    height: 80rpx;
    text-align: center;
    border: 1px solid #333;
    border-radius: 5rpx;
    margin-bottom: 10rpx;
    position: relative;
  }
  .my-selected {
    position: absolute;
    left: 10rpx;
  }
  .user-selected {
    position: absolute;
    right: 10rpx;
  }

</style>
