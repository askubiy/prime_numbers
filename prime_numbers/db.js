function DB() {

  const DB_NAME = 'prime-numbers-db';
  const DB_VERSION = 2;
  const DB_STORE_NAME = 'primal_numbers';

  var db;

  this.openDb = function (defer) {
    console.log("openDb ...");
    console.log(defer);

    var req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onsuccess = function (evt) {
      defer.resolve(true);
      db = this.result;
      console.log("openDb DONE");
    };

    req.onerror = function (evt) {
      defer.resolve(false);
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { autoIncrement: true });
    };

    return req;
  }

  function getObjectStore(mode) {
    var tx = db.transaction(DB_STORE_NAME, mode);
    return tx.objectStore(DB_STORE_NAME);
  }

  function clearObjectStore() {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      console.log("ObjectStore " + DB_STORE_NAME + " cleared");
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
    };
  }

  this.addPrimal = function (primalNumber) {
    console.log("addPrimal arguments: ", primalNumber);

    var store = getObjectStore('readwrite');
    var req = store.add(primalNumber);

    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
    };

    req.onerror = function() {
      console.error("addPublication error", this.error);
    };
  }


  this.getPrimalList = function (store) {
    console.log("getPrimalList");

    if (typeof store == 'undefined')
      store = getObjectStore('readonly');

    var req;
    req = store.count();

    req.onsuccess = function(evt) {
      console.log("Objects count: ", evt.target.result);
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
    };

    req = store.openCursor();
    var primalList = [];

    req.onsuccess = function(evt) {
      var cursor = evt.target.result;

      if (cursor) {
        console.log("getPrimalList cursor:", cursor);
        primalList.push(cursor.value);

        cursor.continue();
      } else {
        console.log("No more entries");
        console.log("====== primalList:");
        console.log(primalList);
      }
    };
  }

}
