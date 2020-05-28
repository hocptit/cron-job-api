# CRON JOB (SUPPORT API)



Hỗ trợ dễ dàng tạo các công việc theo thời gian hệ thống, kết hợp với database dễ dàng tại các API đặt lịch: gửi thông báo, tạo công việc, ...
## Sử dụng

```js
const cron = require('cron-api');
```

### Installation

You can install using [npm](https://www.npmjs.com/package/cron-api).

```
npm install cron-api
```

### Tổng quan

Đang cập nhật


### Định dạng cron time

Bao gồm
```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ ngày trong tuần (0 - 7) (0 or 7 là CHỦ NHẬT)
│    │    │    │    └───── THÁNG (1 - 12)
│    │    │    └────────── NGÀY TRONG THÁNG (1 - 31)
│    │    └─────────────── GIỜ (0 - 23)
│    └──────────────────── PHÚT (0 - 59)
└───────────────────────── GIÂY (0 - 59, OPTIONAL)
```

Ví dụ:

```js
const cron = require('cron-api');
let name = "An";
let text = "Xin chào"
let hello = (a, b)=>{
	console.log(a, b)
};
 let datetime = {
	dayOfWeek: [dayOfWeek.THURSDAY],
	hour: 10,
	minute: 59
}
let j = cron.setTimeToDoJobEveryDayOfWeb("123456", datetime, hello, name, text);
console.log(j)
```



#### List công việc
Bạn sử dụng function `getListScheduleJob()` method:

```js
let listJob = cron.getListScheduleJob();
console.log(listJob);
```


## Copyright and license

Copyright 2020 by Tinasoft.vn.

Licensed under the **[MIT License] [license]**.

