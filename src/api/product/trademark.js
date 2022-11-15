/* 品牌管理数据模块请求接口文件 */

import request from '@/utils/request'

// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}，get请求，需要两个参数：当前页page, 每页的数据条数limit
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })

// 添加品牌的接口
// /admin/product/baseTrademark/save，post请求，需要两个参数-品牌名称: tmName, 品牌LOGO: logoUrl

// 修改品牌的接口
// /admin/product/baseTrademark/update，put请求，需要三个参数-品牌id: id, 品牌名称: tmName, 品牌LOGO: logoUrl
export const reqAddOrUpdateTradeMark = tradeMark => {
  // 如果数据携带id，表示修改
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMark
    })
  }
  // 如果数据不携带id，表示添加
  else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

// 删除品牌接口
// /admin/product/baseTrademark/remove/{id}，delete请求，需要一个参数：id
export const reqDeleteTradeMark = id =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
