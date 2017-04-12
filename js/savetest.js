(function (view) {
	"use strict";
	var
		document = view.document,
		$ = function (id) {
			return document.getElementById(id);
		},
		session = view.sessionStorage,
		txtCode = $("txtCode"),
		frmQuestions = $("frmQuestions"),
		txtFileName = $("txtFileName")

	if (session.code) {
		txtCode.value = session.txtCode;
	}
	if (session.txtFileName) {
		txtFileName.value = session.txtFileName;
	}

	frmQuestions.addEventListener("submit", function (event) {
		event.preventDefault();
		saveAs(
			new Blob(
				[txtCode.value || txtCode.placeholder], {
					type: "application/json;charset=" + document.characterSet
				}
			), (txtFileName.value || txtFileName.placeholder) + ".json"
		);
	}, false);

	view.addEventListener("unload", function () {
		session.txtCode = txtCode.value;
		session.txtFileName = txtFileName.value;
	}, false);
	
}(self));