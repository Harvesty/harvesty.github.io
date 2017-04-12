(function (view) {
	"use strict";
	var
		document = view.document,
		$ = function (id) {
			return document.getElementById(id);
		},
		session = view.sessionStorage,
		txtCode = $("txtCode"),
		txtTest = $("txtTest"),
		frmQuestions = $("frmQuestions"),
		txtFileName = $("txtFileName"),
		pmGetData = getJSON("../data/base.json");

	function getJSON(url) {
		return new Promise(function (resolve, reject) {

			var request = new XMLHttpRequest();
			request.open('GET', url);
			request.responseType = 'json';

			request.onload = function () {
				if (request.status === 200) {
					resolve(request.response);
				} else {
					reject(Error('JSON didn\'t load successfully; error code:' + request.statusText));
				}
			};
			request.onerror = function () {
				reject(Error('There was a network error.'));
			};
			request.send();
		});
	}

	if (session.code) {
		txtCode.value = session.txtCode;
	}
	if (session.txtFileName) {
		txtFileName.value = session.txtFileName;
	}

	frmQuestions.addEventListener("submit", function (event) {
		event.preventDefault();
		pmGetData.then(function (tests) {

			let test = {
				desc: JSON.stringify('test'),
				code: JSON.stringify('code')
			};
			tests.push(test);
			saveAs(
				new Blob(
					[tests], {
						type: "application/json;charset=" + document.characterSet
					}
				), (txtFileName.value || txtFileName.placeholder) + ".json"
			);

		}, function (Error) {
			console.log(Error);
		});

	}, false);

	view.addEventListener("unload", function () {
		session.txtCode = txtCode.value;
		session.txtFileName = txtFileName.value;
	}, false);

}(self));