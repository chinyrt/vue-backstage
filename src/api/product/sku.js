/* SPU模块请求数据接口文件 */

import request from '@/utils/request'

// 获取sku列表的接口
// /admin/product/list/{page}/{limit}，get请求，需要两个参数：page(当前页)、limit(每页记录数)
export const reqSkuList = (page, limit) =>
  request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
  })

// 上架
// /admin/product/onSale/{skuId}，get请求，需要一个参数：skuId
export const reqSkuOnSale = skuId =>
  request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
  })

// 下架
// /admin/product/cancelSale/{skuId}，get请求，需要一个参数：skuId
export const reqSkuCancelSale = skuId =>
  request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
  })

// 查看sku详情信息的接口
// /admin/product/getSkuById/{skuId}，get请求，需要一个参数：skuId
export const reqGetSkuInfo = skuId =>
  request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
  })
