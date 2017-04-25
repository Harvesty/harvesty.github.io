/*  Todo List
	1. 规划及改进模块（需要添加到特性及要改进的地方的列表），放进关于页面？。
	2. Flex布局编辑器。
	3. 自动保存密码。
*/
(function () {
    'use strict';

    var doc = {
        id: document.getElementById,
        class: document.getElementsByClassName,
        first: document.querySelector,
        all: document.querySelectorAll
    };
    var app = {
        isLoading: true,
        visibleCards: {},
        selectedCities: [],
        //spinner: doc.first('.loader'),
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };


    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    /*doc.id('butAdd').addEventListener('click', function () {
        // Open/show the add new city dialog
        app.toggleAddDialog(true);
    });*/



    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add new city dialog.
    app.toggleAddDialog = function (visible) {
        if (visible) {
            app.addDialog.classList.add('dialog-container--visible');
        } else {
            app.addDialog.classList.remove('dialog-container--visible');
        }
    };

    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/



    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw-app.js')
            .then(function () {
                console.log('Service Worker Registered');
            });
    }
})();