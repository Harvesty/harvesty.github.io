(function (view) {
	"use strict";
	var
		document = view.document,
		$ = function (id) {
			return document.getElementById(id);
		},
		session = view.sessionStorage,
		uTests = null, // Unmodified
		mTests = null, // Modified
		btnAdd = $("btnAdd"),
		txtCode = $("txtCode"),
		txtTest = $("txtTest"),
		frmQuestions = $("frmQuestions"),
		txtFileName = $("txtFileName");

	// 函数：获取JSON数据
	function getJSON(url) {
		return new Promise(function (resolve, reject) {

			var request = new XMLHttpRequest();
			request.open('GET', url);
			request.responseType = 'json';

			request.onload = function () {
				if (request.status === 200) {
					resolve(request.response);
				} else {
					reject(Error("JSON didn't load successfully; error code:" + request.statusText));
				}
			};
			request.onerror = function () {
				reject(Error('There was a network error.'));
			};
			request.send();
		});
	}

	// 恢复上次页面关闭前的状态
	if (session.code) {
		txtCode.value = session.txtCode;
	}
	if (session.txtFileName) {
		txtFileName.value = session.txtFileName;
	}

	// 获取试题
	getJSON("../data/base.json").then(function (tests) {
		if (Array.isArray(tests)) {
			uTests = tests;
			mTests = uTests;
		}
	}, function (Error) {
		console.log(Error);
	});

	// 添加试题
	btnAdd.addEventListener("click", function (event) {
		event.preventDefault();

		let test = {
			Q: {
				desc: txtTest.value,
				code: txtCode.value
			},
			A: {
				desc: "",
				code: ""
			}
		};
		mTests.push(test);

	}, false);

	// 下载试题
	frmQuestions.addEventListener("submit", function (event) {
		event.preventDefault();
		pmGetData.then(function (tests) {

			txtTest.value = tests[0].Q.desc;
			txtCode.value = tests[0].Q.code;

			saveAs(
				new Blob(
					[JSON.stringify(mTests)], {
						type: "application/json;charset=" + document.characterSet
					}
				), (txtFileName.value || txtFileName.placeholder) + ".json"
			);

		}, function (Error) {
			console.log(Error);
		});

	}, false);

	// 保存页面关闭前状态。
	view.addEventListener("unload", function () {
		session.txtCode = txtCode.value;
		session.txtFileName = txtFileName.value;
	}, false);

}(self));