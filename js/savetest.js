/*  Todo List
	1. 不同机器之间同步，现在的做法会最后提交会覆盖以前的数据，无法合并。
	2. 利用本地存储保存数据。
	3. 看看能否把Textarea更换为富文本编辑器。
*/

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
		uTests = null, // Unmodified Array
		mTests = null, // Modified Array
		blnEdit = true, // 编辑模式
		iCurrent = 0, // QA 当前所在下标
		txtUser = $("txtUser"),
		txtPwd = $("txtPwd"),
		btnGithub = $("btnGithub"),
		txtCode = $("txtCode"),
		txtTest = $("txtTest"),
		pTest = $("pTest"),
		cdCode = $("cdCode"),
		btnMode = $("btnMode"),
		btnAdd = $("btnAdd"),
		btnDel = $("btnDel"),
		btnSave = $("btnSave"),
		btnPre = $("btnPre"),
		btnNext = $("btnNext"),
		btnFirst = $("btnFirst"),
		btnLast = $("btnLast"),
		btnUpload = $("btnUpload"),
		secEdit = $("secEdit"),
		secPreview = $("secPreview"),
		divModal = $("divModal"),
		btnModalClose = $("btnModalClose"),
		evtClick = new MouseEvent('click', {
			'view': window,
			'bubbles': false,
			'cancelable': true
		});

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
	}

	// 初始化编辑器
	function initEditor(test) {
		txtTest.value = test.Q.desc;
		txtCode.value = test.Q.code;
		txtTest.focus();
	}

	// 初始化编辑器
	function displayTest(test) {
		if (blnEdit) {
			initEditor(test);
		} else {
			preview(test);
		}
	}

	// 初始化编辑器
	function saveTest(event) {
		let test = mTests[iCurrent];
		switch (event.target.id) {
			case 'txtTest':
				test.Q.desc = txtTest.value;
				break;
			case 'txtCode':
				test.Q.code = txtCode.value;
				break;
			case 'txtAns':
				test.A.desc = txtTest.value;
				break;
			case 'txtAnsCode':
				test.A.code = txtTest.value;
				break;
			default:
				break;
		}
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
			displayTest(mTests[iCurrent]);
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

		btnModalClose.dispatchEvent(evtClick);

	}, false);

	// 第一题
	btnFirst.addEventListener("click", function (event) {
		iCurrent = 0;
		displayTest(mTests[iCurrent]);
		btnPre.disabled = true;
		btnFirst.disabled = true;
		if (btnNext.disabled && mTests.length > 1) {
			btnNext.disabled = false;
			btnLast.disabled = false;
		}
	}, false);

	// 上一题
	btnPre.addEventListener("click", function (event) {
		if (iCurrent > 0) {
			iCurrent = iCurrent - 1;
			displayTest(mTests[iCurrent]);
		}
		if (iCurrent === 0) {
			btnPre.disabled = true;
			btnFirst.disabled = true;
		}
		if (btnNext.disabled && mTests.length > 1) {
			btnNext.disabled = false;
			btnLast.disabled = false;
		}
	}, false);

	// 下一题
	btnNext.addEventListener("click", function (event) {
		if (iCurrent < mTests.length - 1) {
			iCurrent = iCurrent + 1;
			displayTest(mTests[iCurrent]);
		}
		if (iCurrent === mTests.length - 1) {
			btnNext.disabled = true;
			btnLast.disabled = true;
		}
		if (btnPre.disabled && mTests.length > 1) {
			btnPre.disabled = false;
			btnFirst.disabled = false;
		}
	}, false);

	// 最后一题
	btnLast.addEventListener("click", function (event) {
		iCurrent = mTests.length - 1;
		displayTest(mTests[iCurrent]);
		btnNext.disabled = true;
		btnLast.disabled = true;
		if (btnPre.disabled && mTests.length > 1) {
			btnPre.disabled = false;
			btnFirst.disabled = false;
		}
	}, false);

	// 添加试题
	btnAdd.addEventListener("click", function (event) {

		if (!blnEdit) {
			btnMode.dispatchEvent(evtClick);
		}

		let last = mTests[mTests.length - 1];
		if (last.Q.desc === "" && last.Q.code === "") {
			iCurrent = mTests.length - 1;
		} else {
			let newTest = {
				Q: {
					desc: "",
					code: ""
				},
				A: {
					desc: "",
					code: ""
				}
			};
			iCurrent = mTests.length;
			mTests.push(newTest);
		}

		displayTest(mTests[iCurrent]);

	}, false);

	// 删除试题
	btnDel.addEventListener("click", function (event) {

	}, false);

	// 保存试题
	txtCode.addEventListener("change", saveTest, false);
	txtTest.addEventListener("change", saveTest, false);

	// 模式切换
	btnMode.addEventListener("click", function (event) {
		blnEdit = !blnEdit;
		displayTest(mTests[iCurrent]);
		if (blnEdit) {
			secEdit.classList.remove('hidden');
			secPreview.classList.add('hidden');
			btnMode.value = '预览';
		} else {
			secPreview.classList.remove('hidden');
			secEdit.classList.add('hidden');
			btnMode.value = '编辑';
		}
	}, false);

	// 保存试题
	btnSave.addEventListener("click", function (event) {

		let newTest = {
			Q: {
				desc: txtTest.value,
				code: txtCode.value
			},
			A: {
				desc: "",
				code: ""
			}
		};
		mTests.push(newTest);
		preview(newTest);
	}, false);

	// 上传试题
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