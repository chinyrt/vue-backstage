/* SPU模块请求接口文件 */

import request from '@/utils/request'

// 获取spu列表数据的接口
// /admin/product/{page}/{limit}，get请求，需要三个参数，page、limit、category3Id
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
  })

// 获取某个spu信息的接口
// /admin/product/getSpuById/{spuId}，get请求，需要一个参数，spuId
export const reqGetSpuMsg = spuId =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
  })

// 获取品牌信息的接口
// /admin/product/baseTrademark/getTrademarkList，get请求，不需要参数
export const reqGetTrademarkList = () =>
  request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
  })

// 获取spu图片的接口
// /admin/product/spuImageList/{spuId}，get请求，需要一个参数，spuId
export const reqSpuImageList = spuId =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
  })

// 获取全部的销售属性的接口
// /admin/product/baseSaleAttrList，get请求，不需要参数
export const reqBaseSaleAttrList = () =>
  request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
  })

// 获取某个spu销售属性的接口
// /admin/product/spuSaleAttrList/{spuId}，get请求，需要一个参数：spuId
export const reqSpuSqleAttrList = spuId =>
  request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
  })

// 修改spu信息或者添加spu的接口
// /admin/product/saveSpuInfo，post请求，需要一个参数：spuInfo
// /admin/product/updateSpuInfo，post请求，需要一个参数：spuInfo
export const reqAddOrUpdateSpu = spuInfo => {
  // 传入的对象携带id，更新spu信息
  if (spuInfo.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
  // 传入的对象不携带id，添加spu
  else {
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除spu的接口
// /admin/product/deleteSpu/{spuId}，delete请求，需要一个参数：spuId
export const reqDeleteSpu = spuId =>
  request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
  })

// 添加sku的接口
// /admin/product/saveSkuInfo，post请求，需要一个参数对象：skuInfo
export const reqAddSku = skuInfo =>
  request({
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data: skuInfo
  })

// 获取sku列表数据的接口
// /admin/product/findBySpuId/{spuId}，get请求，需要一个参数：spuId
export const reqGetSkuList = spuId =>
  request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
  })
