(function (view) {
	"use strict";
	var
		document = view.document,
		$ = function (id) {
			return document.getElementById(id);
		},
		session = view.sessionStorage,
		github = null,
		repository = null,
		currentTest = null, // Modifying Test
		uTests = null, // Unmodified Array
		mTests = null, // Modified Array
		blnEdit = true, // 编辑模式
		txtUser = $("txtUser"),
		txtPwd = $("txtPwd"),
		btnGithub = $("btnGithub"),
		txtCode = $("txtCode"),
		txtTest = $("txtTest"),
		pTest = $("pTest"),
		cdCode = $("cdCode"),
		btnMode = $("btnMode"),
		btnAdd = $("btnAdd"),
		btnUpload = $("btnUpload"),
		secEdit = $("secEdit"),
		secPreview = $("secPreview"),
		divModal = $("divModal"),
		btnModalClose = $("btnModalClose")

	;

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

	// 预览试题
	function preview(test) {
		pTest.textContent = test.Q.desc;
		cdCode.textContent = test.Q.code;
		Prism.highlightElement(cdCode);
		secPreview.classList.remove('hidden');
		secEdit.classList.add('hidden');
		btnMode.value = '编辑';
		blnEdit = true;
	}

	// 初始化编辑器
	function initEditor(test) {
		txtTest.value = test.Q.desc;
		txtCode.value = test.Q.code;
		secEdit.classList.remove('hidden');
		secPreview.classList.add('hidden');
		btnMode.value = '预览';
		blnEdit = false;
	}

	// 恢复上次页面关闭前的状态
	/*if (session.code) {
		txtCode.value = session.txtCode;
	}
	if (session.txtFileName) {
		txtFileName.value = session.txtFileName;
	}*/

	// 获取试题
	getJSON("../data/base.json").then(function (tests) {
		if (Array.isArray(tests)) {
			uTests = tests;
			mTests = uTests;
			currentTest = mTests[0];
			preview(currentTest);
		}
	}, function (Error) {
		console.log(Error);
	});

	// 初始化Github组件
	btnGithub.addEventListener("click", function (event) {

		github = new GitHub({
			username: txtUser.value,
			password: txtPwd.value,
			auth: 'basic'
		});
		repository = github.getRepo(txtUser.value, 'harvesty.github.io');

		let evtClick = new MouseEvent('click', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		btnModalClose.dispatchEvent(evtClick);

	}, false);

	// 模式切换
	btnMode.addEventListener("click", function (event) {
		if (blnEdit) {
			initEditor(currentTest);
		} else {
			preview(currentTest);
		}
	}, false);

	// 添加试题
	btnAdd.addEventListener("click", function (event) {

		currentTest = {
			Q: {
				desc: txtTest.value,
				code: txtCode.value
			},
			A: {
				desc: "",
				code: ""
			}
		};
		mTests.push(currentTest);
		preview(currentTest);
	}, false);

	// 保存试题
	btnUpload.addEventListener("click", function (event) {

		if (!github) {
			divModal.classList.remove('hidden');
			return false;
		}

		repository.writeFile(
			'master', // the name of the branch
			'data/base.json', // the path for the file
			JSON.stringify(mTests), // the contents of the file
			'save the tests', // the commit message
			function (error, result, request) {
				if (error) {
					alert("Save failed");
				}
			}
		);

	}, false);

	// 关闭Modal
	btnModalClose.addEventListener("click", function (event) {
		divModal.classList.add('hidden');
	}, false);

	// 保存页面关闭前状态。
	/*view.addEventListener("unload", function () {
		session.txtCode = txtCode.value;
		session.txtFileName = txtFileName.value;
	}, false);*/

}(self));