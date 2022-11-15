/* 平台属性管理模块请求接口文件 */

import request from '@/utils/request'

// 获取一级分类接口
// /admin/product/getCategory1，get请求，不需要参数
export const reqCategory1List = () =>
  request({
    url: '/admin/product/getCategory1',
    method: 'get'
  })

// 获取二级分类接口
// /admin/product/getCategory2/{category1Id}，get请求，需要参数：一级分类id - category1Id
export const reqCategory2List = category1Id =>
  request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
  })

// 获取三级分类接口
// /admin/product/getCategory3/{category2Id}，get请求，需要参数：二级分类id - category2Id
export const reqCategory3List = category2Id =>
  request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
  })

// 获取平台属性接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}，get请求，需要三个参数
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })

// 添加属性或更新属性值的接口
// /admin/product/saveAttrInfo，post请求，需要传入参数对象如下：
/* 
  {
    "attrName": "", // 属性名
    "attrValueList": [ // 属性值
      {
        "attrId": "",
        "valueName": ""
      }
    ],
    "categoryId": "", // 三级分类id
    "categoryLevel": 3, // 区分分类等级的，三级分类
  }
*/
export const reqAddOrUpdateAttr = baseAttrInfo =>
  request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data: baseAttrInfo
  })
