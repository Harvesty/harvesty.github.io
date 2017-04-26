;
      
window.indexedDB = window.indexedDB ||
                   window.mozIndexedDB ||
                   window.webkitIndexedDB ||
                   window.msIndexedDB;
      
window.IDBTransaction = window.IDBTransaction ||
                   window.webkitIDBTransaction ||
                   window.msIDBTransaction;
      
window.IDBKeyRange = window.IDBKeyRange ||
                   window.webkitIDBKeyRange ||
                   window.msIDBKeyRange;
      
(function (w) {
    'use strict';
    var db = {
        version: 1,
        objectStoreName: 'tasks',
        instance: {},
        upgrade: function (e) {
            var
                _db = e.target.result,
                names = _db.objectStoreNames,
                name = db.objectStoreName;
            if (!names.contains(name)) {
                _db.createObjectStore(
                    name, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
            }
        },
        errorHandler: function (error) {
            w.alert('error: ' + error.target.code);
        },
        open: function (callback) {
            var request = w.indexedDB.open(db.objectStoreName, db.version);
            request.onerror = db.errorHandler;
            request.onupgradeneeded = db.upgrade;
            request.onsuccess = function (e) {
                db.instance = request.result;
                db.instance.onerror = db.errorHandler;
                callback();
            };
        },
        getStore: function (mode) {
            var txn, store;
            mode = mode || 'readonly';
            txn = db.instance.transaction(
                [db.objectStoreName], mode);
            store = txn.objectStore(
                db.objectStoreName);
            return store;
        },
        save: function (data, callback) {
            db.open(function () {
                var store, request,
                    mode = 'readwrite';

                store = db.getStore(mode),
                    request = data.id ?
                    store.put(data) :
                    store.add(data);
                request.onsuccess = callback;
            });
        },
        getAll: function (callback) {

            db.open(function () {

                var
                    store = db.getStore(),
                    cursor = store.openCursor(),
                    data = [];

                cursor.onsuccess = function (e) {

                    var result = e.target.result;

                    if (result && result !== null) {

                        data.push(result.value);
                        result.continue();

                    } else {

                        callback(data);
                    }
                };

            });
        },
        get: function (id, callback) {
            id = parseInt(id);
            db.open(function () {
                var
                    store = db.getStore(),
                    request = store.get(id);
                request.onsuccess = function (e) {
                    callback(e.target.result);
                };
            });
        },
        'delete': function (id, callback) {
            id = parseInt(id);
            db.open(function () {
                var
                    mode = 'readwrite',
                    store, request;
                store = db.getStore(mode);
                request = store.delete(id);
                request.onsuccess = callback;
            });
        },
        deleteAll: function (callback) {
            db.open(function () {
                var mode, store, request;
                mode = 'readwrite';
                store = db.getStore(mode);
                request = store.clear();
                request.onsuccess = callback;
            });
        }
    };

    w.IDB = db;

}(window));