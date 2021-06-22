import request from '@/utils/request'

// 字典值
export function getDict (params) {
  return request({
    url: 'system/api/dict/byType',
    method: 'get',
    params
  })
}

/* 题库类型 */
// 列表
export function handleQuestList (params) {
  return request({
    url: 'fire/api/questionType/list',
    method: 'get',
    params
  })
}

// 详情
export function handleQuestInfo (data) {
  return request({
    url: `fire/api/questionType/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function handleQuestUpdate (data) {
  return request({
    url: 'fire/api/questionType/update',
    method: 'PUT',
    data
  })
}

// 新增
export function handleQuestSave (data) {
  return request({
    url: 'fire/api/questionType/save',
    method: 'post',
    data
  })
}

// 删除
export function handleQuestDelete (data) {
  return request({
    url: 'fire/api/questionType/deleteIds',
    method: 'DELETE',
    data
  })
}
/* 题库类型 */

/* 试卷配置 */
// 列表
export function getTestpaperList (params) {
  return request({
    url: 'fire/api/testpaper/list',
    method: 'get',
    params
  })
}

// 详情
export function getTestPaperInfo (data) {
  return request({
    url: `fire/api/testpaper/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function testPaperUpdate (data) {
  return request({
    url: 'fire/api/testpaper/update',
    method: 'PUT',
    data
  })
}

// 新增
export function testPaperSave (data) {
  return request({
    url: 'fire/api/testpaper/save',
    method: 'post',
    data
  })
}

// 删除
export function testPaperDelete (data) {
  return request({
    url: 'fire/api/testpaper/delete',
    method: 'DELETE',
    data
  })
}

// 获取题目列表
export function getSubjectList (params) {
  return request({
    url: 'fire/api/question/selectStatistics',
    method: 'get',
    params
  })
}

/* 试卷配置 */

/* 题库 */
// 题库类别
export function handleQuestionCategory (data) {
  return request({
    url: 'fire/api/question/selectTopicCategory',
    method: 'post',
    data
  })
}

// 列表
export function handleQuestionList (params) {
  return request({
    url: 'fire/api/question/selectSubjectList',
    method: 'get',
    params
  })
}

// 详情
export function handleQuestionInfo (data) {
  return request({
    url: `fire/api/question/info/${data.id}`,
    method: 'get',
    params: data.params
  })
}

// 更新
export function handleQuestionUpdate (data) {
  return request({
    url: 'fire/api/question/update',
    method: 'post',
    data
  })
}

// 新增
export function handleQuestionSave (data) {
  return request({
    url: 'fire/api/question/save',
    method: 'post',
    data
  })
}

// 删除
export function handleQuestionDelete (data) {
  return request({
    url: 'fire/api/question/delete',
    method: 'DELETE',
    data
  })
}

// 下载模板
export function handleQuestionDownload (params) {
  return request({
    url: 'fire/api/question/choiceTemplate',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 下载模板
export function handleQuestionJudgeDownload (params) {
  return request({
    url: 'fire/api/question/judgeTemplate',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 单选/多选上传模板
export function handleQuestionImport (data) {
  return request({
    url: `fire/api/question/import/${data.type}`,
    method: 'post',
    data: data.params
  })
}

// 判断上传模板
export function handleQuestionJudgeImport (data) {
  return request({
    url: 'fire/api/question/importJudge',
    method: 'post',
    data: data.params
  })
}

/* 题库 */
