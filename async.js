const async = require('neo-async')

const deps = [
  {
    factory: 'NormalModuleFactory',
    dependencies: ['dependency1-1', 'dependency1-2']
  },
  {
    factory: 'NormalModuleFactory',
    dependencies: ['dependency2-1', 'dependency2-2', 'dependency2-3']
  },
  {
    factory: 'NormalModuleFactory',
    dependencies: ['dependency3-1']
  }
]

var array = [1, 2, 3]

// function someAsyncFun(data, callback) {
//   // if (data > 2) return callback('err: 数字不能大于2')
//   const newData = data * 2
//   callback(null, newData)
// }

var someAsyncFun = (data, cb) =>
  setTimeout(() => {
    if (data === 2) return cb('err: 数字不能等于2')
    const newData = data * 2
    cb(null, newData)
  }, data * 1000)
var iterator = function (item, callback) {
  someAsyncFun(item, (err, result) => {
    console.log(result)
    if (err) return callback(err)
    callback(null, result)
  })
}
// async.each(array, iterator, function (err, res) {
//   console.log('回调执行：', err, res)
// })

async.each(
  array,
  (item, callback) => {
    // someAsyncFun(item, (err, result) => {
    //   console.log(result)
    //   callback()
    //   // if (err) callback(err)
    // })
    setTimeout(() => {
      const newData = item * 2
      // callback()
      console.log(newData)
      if (item === 2) return callback('err: 数字不能等于2')
      callback()
    }, Math.random() * 1000)
  },
  err => {
    console.log('回调执行：', err)
    process.nextTick(() => {
      console.log('process.nextTick 执行啦')
    })
  }
)

async.each(
  deps,
  (item, callback) => {
    // 异步功能
    // 当 item 处理完成会马上调用 它的回调，即 callback1
    // semaphore.acquire(() => {
    // create(item.dependencies, (err, result) => {
    //   if (!result) {
    //     // semaphore.release();
    //     return process.nextTick(callback)
    //   }
    // })
    // })
    setTimeout(() => {
      //console.log(item.dependencies)
      if (item.dependencies.length > 1) return callback('数量太多')
      callback()
    }, Math.random() * 1000)
    // callback('undefined')
  },
  err => {
    //console.log('aaa', err)
    // if (err) console.log(err)
    //if (err) return callback(err)
    // return process.nextTick(callback)
  }
)
