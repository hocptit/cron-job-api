"use strict";
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ ngày trong tuần (0 - 7) (0 or 7 là CHỦ NHẬT)
// │    │    │    │    └───── THÁNG (1 - 12)
// │    │    │    └────────── NGÀY TRONG THÁNG (1 - 31)
// │    │    └─────────────── GIỜ (0 - 23)
// │    └──────────────────── PHÚT (0 - 59)
// └───────────────────────── GIÂY (0 - 59, OPTIONAL)

/**
 * Module:    Schedule ron job by time format by module "moment"
 * Author:    Tinasoft.vn
 * @version:  v1.0.0
 * Create:    22/2/2020      by @Someone
 * Modified:
 *
 */

const schedule = require('node-schedule');
const moment = require("moment");
const debug = require("debug")("debug:schedule");
const parser = require('cron-parser');

//Var global
const dayOfWeek = {
	SUNDAY: 0,
	MONDAY: 1,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 7
};

/**
 *@description xem những thời gian thực hiện tiếp theo theo quy tắc cron
 * @param {String} expression
 * @param {Number} number - số lần kế tiếp
 * @example convertCronTab("5 6-50/10 * * * *", 10)
 * @example dataReturn
 * Lần tiếp (1) : Sat Feb 22 2020 11:26:05 GMT+0700
	Lần tiếp (2) : Sat Feb 22 2020 11:36:05 GMT+0700
	Lần tiếp (3) : Sat Feb 22 2020 11:46:05 GMT+0700
	Lần tiếp (4) : Sat Feb 22 2020 12:06:05 GMT+0700
	Lần tiếp (5) : Sat Feb 22 2020 12:16:05 GMT+0700
	Lần tiếp (6) : Sat Feb 22 2020 12:26:05 GMT+0700
	Lần tiếp (7) : Sat Feb 22 2020 12:36:05 GMT+0700
	Lần tiếp (8) : Sat Feb 22 2020 12:46:05 GMT+0700
	Lần tiếp (9) : Sat Feb 22 2020 13:06:05 GMT+0700
	Lần tiếp (10) : Sat Feb 22 2020 13:16:05 GMT+0700
 */
function convertCronTab(expression, number) {
	try {
		if (!Number.isInteger(number)) throw Error("Invalid Number");
		if (number > 5000) {
			number = 5000
		}
		let interval = parser.parseExpression(expression);
		for (let i = 0; i < number; i++) {
			console.log(`Thời gian kế tiếp (${i + 1}) :`, interval.next().toString());
		}
	} catch (err) {
		throw err
	}
}

function checkIsJobIdExist(jobId) {
	if (!jobId) return Error("JobId is not null");
	return null
}


/**
 * @description đặt giờ thực hiện function
 * @param {String} jobId id của công việc
 * @param {Date} datetime - thời gian theo định dạng moment (YYYY-MM-DD HH:mm:ss)
 * @param {function} job - công việc cần làm
 * @param arg
 * @returns {[]}
 */

function setTimeToDoJob(jobId, datetime, job, ...arg) {
	try {
		let checkJobId = checkIsJobIdExist(jobId);
		if (checkJobId) return [checkJobId];
		if (!moment(datetime, "YYYY-MM-DD HH:mm:ss").isValid()) return [new Error("Invalid time")];
		let mm = moment(datetime, "YYYY-MM-DD HH:mm:ss");
		let setTime = new Date(mm.year(), mm.month(), mm.date(), mm.hour(), mm.minute(), mm.second());
		console.log(`Now: ${moment().format("YYYY-MM-DD HH:mm:ss")}`);
		console.log(`Time cron job: ${setTime}`);
		schedule.scheduleJob(jobId, setTime, job.bind(null, ...arg));
		return [null, jobId]
	} catch (e) {
		debug(e);
		return [e]
	}
}

/**
 * @description GỬI THÔNG BÁO HÀNG TUẦN
 * @param jobId
 * @param datetime
 * @param job
 * @param arg
 * @returns {Error[]|*[]}
 *
 * @example
 * let a = "xin chao";
let b = " hello"
let hello = (c, d)=>{
	console.log(c, d)
};
 let datetime = {
	dayOfWeek: [dayOfWeek.THURSDAY],
	hour: 10,
	minute: 59
}
console.log(setTimeToDoJobEveryDayOfWeb("123456", datetime, hello, a, b))

setInterval(()=>{
	console.log(getListScheduleJob())
}, 1000 * 5)
 */

function setTimeToDoJobEveryDayOfWeb(jobId, datetime, job, ...arg) {
	try {
		let checkJobId = checkIsJobIdExist(jobId);
		if (checkJobId) return [checkJobId];
		//validator
		let rule = new schedule.RecurrenceRule();
		rule.dayOfWeek = [...datetime.dayOfWeek];
		rule.hour = datetime.hour;
		rule.minute = datetime.minute;
		schedule.scheduleJob(jobId, rule, job.bind(null, ...arg));
		return [null, jobId]
	} catch (e) {
		debug(e);
		return [e]
	}
}

function convertNextInvocationToDate(func) {
	let dt = func();
	if (!dt) return null;
	return dt._date.format("YYYY-MM-DD HH:mm:ss")
}

/**
 * @description lấy danh sách các công việc đang thực hiện
 * @returns {[]}
 */

function getListScheduleJob() {
	let list = schedule.scheduledJobs;
	if (typeof list !== "object") return [];

	let listDetailJob = Object.values(list);
	let detailList = [];
	for (let i = 0; i < listDetailJob.length; i++) {

		let dateNext = convertNextInvocationToDate(listDetailJob[i].nextInvocation);
		detailList.push({
			jobId: listDetailJob[i].name,
			dateNextTodo: dateNext
		})
	}
	return detailList
}


/**
 * @description hủy bỏ một công việc
 * @param jobId
 */

function cancelScheduleJob(jobId) {
	let list = schedule.scheduledJobs;
	let arrayJob = Object.keys(list);
	if (arrayJob.includes(jobId)) {
		let job = schedule.scheduledJobs[jobId];
		job.cancel();
	}
}

/**
 * @description tối ưu hóa module, xóa các công việc rác còn lưu trong bộ nhớ khi đã thực hiện
 */

function optimalSchedule() {
	try {
		let list = schedule.scheduledJobs;
		let listDetailJob = Object.values(list);
		if (listDetailJob.length > 0) {
			for (let i = 0; i < listDetailJob.length; i++) {
				if (!listDetailJob[i].nextInvocation()) {
					console.log("Delete jobId: " + listDetailJob[i].name);
					let job = schedule.scheduledJobs[listDetailJob[i].name];
					job.cancel();
				}
			}
		}
	} catch (e) {
		debug(e)
	}
}


/**
 * @description đặt lịch bằng setTimeout và không thể hủy, dùng để update dữ liệu,
 * Tối đa trong 1 tuần (Không nên dùng trong time dài)
 * @param {Date} timesStart
 * @param {Function} task không gồm đối số
 * @param {*} agr biến số của job
 * @returns {Error|number}
 *
 * @example  toDo("2020/22/22 22:22:23", job, arg1, arg2, arg3)
 */

function toDo(timesStart, task, ...agr) {
	let timeStampNow = moment().format("X");
	let timeStampStart = moment(timesStart).format("X");
	if (timeStampNow > timeStampStart) return new Error("invalid");
	debug("Công việc sẽ được thực hiện lúc : " + timesStart);
	return setTimeout(task, 1000 * (timeStampStart - timeStampNow), ...agr);
}


module.exports = {
	toDo,
	dayOfWeek,
	convertCronTab,
	setTimeToDoJob,
	getListScheduleJob,
	cancelScheduleJob,
	optimalSchedule
};