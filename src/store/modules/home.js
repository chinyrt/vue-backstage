import mockRequest from '@/utils/mockRequest'

const actions = {
  // 发请求获取首页的 mock 数据
  async getData({ commit }) {
    let result = await mockRequest.get('/home/list')
    if (result.code === 20000) {
      commit('GETDATA', result.data)
    }
  }
}
const mutations = {
  GETDATA(state, list) {
    state.list = list
    state.tableList = list.searchWord
    state.saleRank = list.saleRank
  }
}
const state = {
  // 数据源
  list: {},
  tableList: [],
  saleRank: {}
}
const getters = {
  getOnline(state) {
    let arr = JSON.parse(JSON.stringify(state.saleRank))
    // console.log(state)
    console.log(arr)
    // console.log(a, b, c)
  }
}
export default {
  actions,
  mutations,
  state,
  getters
}
