/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "10c300a69456c682c61f"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/ra-project03/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _App = __webpack_require__(1);\n\nvar _App2 = _interopRequireDefault(_App);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar app = new _App2.default();//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/OTU1MiJdLCJuYW1lcyI6WyJhcHAiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztBQUVBLElBQUlBLE1BQU0sbUJBQVYiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcHAgZnJvbSAnLi9BcHAnO1xuXG5sZXQgYXBwID0gbmV3IEFwcCgpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _ShoppingCart = __webpack_require__(2);\n\nvar _ShoppingCart2 = _interopRequireDefault(_ShoppingCart);\n\nvar _BBProductAPIService = __webpack_require__(3);\n\nvar _BBProductAPIService2 = _interopRequireDefault(_BBProductAPIService);\n\nvar _BBProductData = __webpack_require__(4);\n\nvar _BBProductData2 = _interopRequireDefault(_BBProductData);\n\nvar _Catalog = __webpack_require__(5);\n\nvar _Catalog2 = _interopRequireDefault(_Catalog);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar App = function () {\n    function App() {\n        _classCallCheck(this, App);\n\n        console.log('creating app');\n        this.cartData = [];\n        this.getTheData();\n        this.catalog = new _Catalog2.default();\n        this.initModal();\n        this.shoppingCart = new _ShoppingCart2.default();\n        this.displayShoppingCart();\n    }\n\n    _createClass(App, [{\n        key: 'displayShoppingCart',\n        value: function displayShoppingCart() {\n            console.log('you are in the app displayShoppingCart function');\n            var context = this;\n            $('#cart').on('click', null, { context: context }, function (evt) {\n                context.modal.style.display = \"block\";\n                context.shoppingCart.showCart(evt, context);\n            });\n        }\n    }, {\n        key: 'initModal',\n        value: function initModal() {\n            // Get the modal\n            this.modal = document.getElementById('myModal');\n\n            // Get the <span> element that closes the modal\n            this.closeSpan = document.getElementsByClassName(\"close\")[0];\n            // When the user clicks on <span> (x), close the modal\n            this.closeSpan.onclick = function () {\n                $(\"#myModal\").css('display', 'none');\n            };\n\n            // When the user clicks anywhere outside of the modal, close it\n            /* window.onclick = function(event) {\n                 if (event.target == this.modal) {\n                     this.modal.style.display = \"none\";\n                 }\n             }*/\n        }\n    }, {\n        key: 'getTheData',\n        value: function getTheData() {\n            // load the data\n            this.bbAPIService = new _BBProductAPIService2.default();\n            var context = this;\n            this.successCallback = function (response) {\n                context.data = JSON.parse(response);context.processResultsIntoUsableData(context.data);\n            };\n            this.failCallback = function (error) {\n                console.error('Failed! \\n', error);\n            };this.bbAPIService.loadDataUsingJS().then(this.successCallback, this.failCallback);\n        }\n    }, {\n        key: 'processResultsIntoUsableData',\n        value: function processResultsIntoUsableData(result) {\n            // from here, extract only the product info\n            this.rawData = new _BBProductData2.default(result);\n            this.products = this.rawData.products;\n            this.createTableOfItems(this.products);\n        }\n    }, {\n        key: 'createTableOfItems',\n        value: function createTableOfItems(products) {\n            var _this = this;\n\n            // Adding html to flickity $('.product-list').flickity\n\n            var productCells = this.catalog.showCatalogProducts(products);\n            document.getElementById('productList').innerHTML = productCells;\n\n            // ADDING EVENT LISTENERS TO THE BUTTONS\n\n            var _loop = function _loop(btnCount) {\n                var currentItem = products[btnCount];\n                //console.log('currentItem is ' + currentItem['sku']); \n                var context = _this;\n\n                // add to cart\n                $('#' + currentItem['sku']).on('click', null, { context: context }, function (event) {\n                    context.modal.style.display = \"block\";\n                    context.prepareItemToAddToCart(event, context);\n                });\n\n                // quick view\n                $('#quickView-' + currentItem['sku']).on('click', null, { context: context }, function (event) {\n                    context.modal.style.display = \"block\";\n                    context.showQuickView(event, context);\n                });\n            };\n\n            for (var btnCount = 0; btnCount < products.length; btnCount++) {\n                _loop(btnCount);\n            }\n        }\n    }, {\n        key: 'prepareItemToAddToCart',\n        value: function prepareItemToAddToCart(evt, context) {\n            if (evt == null || typeof evt === 'undefined') {\n                return;\n            }\n            var sku = $(evt.target).data('sku');\n            console.log(sku);\n            var productAdded = this.getProductBySku(sku);\n            $('#shoppingCartContent').html(\"\");\n            $('#content').last().html('<img src=\"' + productAdded.thumbnailImage + '\" alt=\"' + productAdded.name + '\" title=\"' + productAdded.name + '\"><b>' + productAdded.name + '</b><br>has been added to the cart.<br>');\n            context.shoppingCart.addItemToCart(1, sku);\n        }\n    }, {\n        key: 'showQuickView',\n        value: function showQuickView(evt, context) {\n            if (evt == null || typeof evt === 'undefined') {\n                return;\n            }\n            var sku = $(evt.target).data('sku');\n            var productAdded = this.getProductBySku(sku);\n            $('#shoppingCartContent').html(\"\");\n            $('#content').last().html('<img src=\"' + productAdded.thumbnailImage + '\" alt=\"' + productAdded.name + '\" title=\"' + productAdded.name + '\"><b>' + productAdded.name + '</b><br><b>$' + productAdded.salePrice + '</b><p>' + productAdded.shortDescription + '<p><br>');\n        }\n    }, {\n        key: 'getProductBySku',\n        value: function getProductBySku() {\n            var sku = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n\n            if (sku == 0) {\n                return;\n            };\n            var criteriaFn = function criteriaFn(product) {\n                return product['sku'] == sku;\n            };\n            var result = this.products.filter(criteriaFn);\n            console.log(result);\n            return result[0];\n        }\n    }]);\n\n    return App;\n}();\n\nexports.default = App;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQXBwLmpzP2E2NzMiXSwibmFtZXMiOlsiQXBwIiwiY29uc29sZSIsImxvZyIsImNhcnREYXRhIiwiZ2V0VGhlRGF0YSIsImNhdGFsb2ciLCJpbml0TW9kYWwiLCJzaG9wcGluZ0NhcnQiLCJkaXNwbGF5U2hvcHBpbmdDYXJ0IiwiY29udGV4dCIsIiQiLCJvbiIsImV2dCIsIm1vZGFsIiwic3R5bGUiLCJkaXNwbGF5Iiwic2hvd0NhcnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY2xvc2VTcGFuIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsIm9uY2xpY2siLCJjc3MiLCJiYkFQSVNlcnZpY2UiLCJzdWNjZXNzQ2FsbGJhY2siLCJyZXNwb25zZSIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJwcm9jZXNzUmVzdWx0c0ludG9Vc2FibGVEYXRhIiwiZmFpbENhbGxiYWNrIiwiZXJyb3IiLCJsb2FkRGF0YVVzaW5nSlMiLCJ0aGVuIiwicmVzdWx0IiwicmF3RGF0YSIsInByb2R1Y3RzIiwiY3JlYXRlVGFibGVPZkl0ZW1zIiwicHJvZHVjdENlbGxzIiwic2hvd0NhdGFsb2dQcm9kdWN0cyIsImlubmVySFRNTCIsImJ0bkNvdW50IiwiY3VycmVudEl0ZW0iLCJldmVudCIsInByZXBhcmVJdGVtVG9BZGRUb0NhcnQiLCJzaG93UXVpY2tWaWV3IiwibGVuZ3RoIiwic2t1IiwidGFyZ2V0IiwicHJvZHVjdEFkZGVkIiwiZ2V0UHJvZHVjdEJ5U2t1IiwiaHRtbCIsImxhc3QiLCJ0aHVtYm5haWxJbWFnZSIsIm5hbWUiLCJhZGRJdGVtVG9DYXJ0Iiwic2FsZVByaWNlIiwic2hvcnREZXNjcmlwdGlvbiIsImNyaXRlcmlhRm4iLCJwcm9kdWN0IiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVxQkEsRztBQUNqQixtQkFBYztBQUFBOztBQUNWQyxnQkFBUUMsR0FBUixDQUFZLGNBQVo7QUFDQSxhQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsYUFBS0MsVUFBTDtBQUNBLGFBQUtDLE9BQUwsR0FBZSx1QkFBZjtBQUNBLGFBQUtDLFNBQUw7QUFDQSxhQUFLQyxZQUFMLEdBQW9CLDRCQUFwQjtBQUNBLGFBQUtDLG1CQUFMO0FBQ0g7Ozs7OENBRW9CO0FBQ2pCUCxvQkFBUUMsR0FBUixDQUFZLGlEQUFaO0FBQ0EsZ0JBQUlPLFVBQVUsSUFBZDtBQUNBQyxjQUFFLE9BQUYsRUFBV0MsRUFBWCxDQUFjLE9BQWQsRUFBc0IsSUFBdEIsRUFBMkIsRUFBQ0YsU0FBUUEsT0FBVCxFQUEzQixFQUE2QyxVQUFTRyxHQUFULEVBQWE7QUFDdERILHdCQUFRSSxLQUFSLENBQWNDLEtBQWQsQ0FBb0JDLE9BQXBCLEdBQThCLE9BQTlCO0FBQ0FOLHdCQUFRRixZQUFSLENBQXFCUyxRQUFyQixDQUE4QkosR0FBOUIsRUFBbUNILE9BQW5DO0FBQ0gsYUFIRDtBQUlIOzs7b0NBRVU7QUFDUDtBQUNBLGlCQUFLSSxLQUFMLEdBQWFJLFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBYjs7QUFFQTtBQUNBLGlCQUFLQyxTQUFMLEdBQWlCRixTQUFTRyxzQkFBVCxDQUFnQyxPQUFoQyxFQUF5QyxDQUF6QyxDQUFqQjtBQUNBO0FBQ0EsaUJBQUtELFNBQUwsQ0FBZUUsT0FBZixHQUF5QixZQUFXO0FBQ2hDWCxrQkFBRSxVQUFGLEVBQWNZLEdBQWQsQ0FBa0IsU0FBbEIsRUFBNkIsTUFBN0I7QUFDSCxhQUZEOztBQUlBO0FBQ0Q7Ozs7O0FBS0Y7OztxQ0FFVztBQUNSO0FBQ0EsaUJBQUtDLFlBQUwsR0FBb0IsbUNBQXBCO0FBQ0EsZ0JBQUlkLFVBQVUsSUFBZDtBQUNBLGlCQUFLZSxlQUFMLEdBQXVCLFVBQVNDLFFBQVQsRUFBbUI7QUFDdENoQix3QkFBUWlCLElBQVIsR0FBZUMsS0FBS0MsS0FBTCxDQUFXSCxRQUFYLENBQWYsQ0FBcUNoQixRQUFRb0IsNEJBQVIsQ0FBcUNwQixRQUFRaUIsSUFBN0M7QUFDeEMsYUFGRDtBQUdELGlCQUFLSSxZQUFMLEdBQW9CLFVBQVNDLEtBQVQsRUFBZ0I7QUFDaEM5Qix3QkFBUThCLEtBQVIsQ0FBYyxZQUFkLEVBQTRCQSxLQUE1QjtBQUNILGFBRkQsQ0FFRyxLQUFLUixZQUFMLENBQWtCUyxlQUFsQixHQUFvQ0MsSUFBcEMsQ0FBeUMsS0FBS1QsZUFBOUMsRUFBK0QsS0FBS00sWUFBcEU7QUFDTDs7O3FEQUU0QkksTSxFQUFPO0FBQ2hDO0FBQ0EsaUJBQUtDLE9BQUwsR0FBZSw0QkFBbUJELE1BQW5CLENBQWY7QUFDQSxpQkFBS0UsUUFBTCxHQUFnQixLQUFLRCxPQUFMLENBQWFDLFFBQTdCO0FBQ0EsaUJBQUtDLGtCQUFMLENBQXdCLEtBQUtELFFBQTdCO0FBQ0g7OzsyQ0FFa0JBLFEsRUFBUztBQUFBOztBQUN4Qjs7QUFFQSxnQkFBSUUsZUFBZSxLQUFLakMsT0FBTCxDQUFha0MsbUJBQWIsQ0FBaUNILFFBQWpDLENBQW5CO0FBQ0FuQixxQkFBU0MsY0FBVCxDQUF3QixhQUF4QixFQUF1Q3NCLFNBQXZDLEdBQW1ERixZQUFuRDs7QUFFQTs7QUFOd0IsdUNBT2ZHLFFBUGU7QUFRcEIsb0JBQUlDLGNBQWNOLFNBQVNLLFFBQVQsQ0FBbEI7QUFDQTtBQUNBLG9CQUFJaEMsZUFBSjs7QUFFQTtBQUNBQyxrQkFBRSxNQUFJZ0MsWUFBWSxLQUFaLENBQU4sRUFBMEIvQixFQUExQixDQUE2QixPQUE3QixFQUFzQyxJQUF0QyxFQUE0QyxFQUFDRixTQUFRQSxPQUFULEVBQTVDLEVBQStELFVBQVNrQyxLQUFULEVBQWU7QUFDMUVsQyw0QkFBUUksS0FBUixDQUFjQyxLQUFkLENBQW9CQyxPQUFwQixHQUE4QixPQUE5QjtBQUNBTiw0QkFBUW1DLHNCQUFSLENBQStCRCxLQUEvQixFQUFzQ2xDLE9BQXRDO0FBQ0gsaUJBSEQ7O0FBS0E7QUFDQUMsa0JBQUUsZ0JBQWNnQyxZQUFZLEtBQVosQ0FBaEIsRUFBb0MvQixFQUFwQyxDQUF1QyxPQUF2QyxFQUFnRCxJQUFoRCxFQUFzRCxFQUFDRixTQUFRQSxPQUFULEVBQXRELEVBQXlFLFVBQVNrQyxLQUFULEVBQWU7QUFDcEZsQyw0QkFBUUksS0FBUixDQUFjQyxLQUFkLENBQW9CQyxPQUFwQixHQUE4QixPQUE5QjtBQUNBTiw0QkFBUW9DLGFBQVIsQ0FBc0JGLEtBQXRCLEVBQTZCbEMsT0FBN0I7QUFDSCxpQkFIRDtBQW5Cb0I7O0FBT3hCLGlCQUFLLElBQUlnQyxXQUFTLENBQWxCLEVBQXFCQSxXQUFTTCxTQUFTVSxNQUF2QyxFQUErQ0wsVUFBL0MsRUFBMEQ7QUFBQSxzQkFBakRBLFFBQWlEO0FBZ0J6RDtBQUNKOzs7K0NBRXNCN0IsRyxFQUFLSCxPLEVBQVE7QUFDaEMsZ0JBQUdHLE9BQUssSUFBTCxJQUFhLE9BQVFBLEdBQVIsS0FBaUIsV0FBakMsRUFBNkM7QUFDekM7QUFDSDtBQUNELGdCQUFJbUMsTUFBTXJDLEVBQUVFLElBQUlvQyxNQUFOLEVBQWN0QixJQUFkLENBQW1CLEtBQW5CLENBQVY7QUFDQXpCLG9CQUFRQyxHQUFSLENBQVk2QyxHQUFaO0FBQ0EsZ0JBQUlFLGVBQWUsS0FBS0MsZUFBTCxDQUFxQkgsR0FBckIsQ0FBbkI7QUFDQXJDLGNBQUUsc0JBQUYsRUFBMEJ5QyxJQUExQixDQUErQixFQUEvQjtBQUNBekMsY0FBRSxVQUFGLEVBQWMwQyxJQUFkLEdBQXFCRCxJQUFyQixDQUEwQixlQUFhRixhQUFhSSxjQUExQixHQUF5QyxTQUF6QyxHQUFtREosYUFBYUssSUFBaEUsR0FBcUUsV0FBckUsR0FBaUZMLGFBQWFLLElBQTlGLEdBQW1HLE9BQW5HLEdBQTRHTCxhQUFhSyxJQUF6SCxHQUErSCx5Q0FBeko7QUFDQTdDLG9CQUFRRixZQUFSLENBQXFCZ0QsYUFBckIsQ0FBbUMsQ0FBbkMsRUFBc0NSLEdBQXRDO0FBQ0g7OztzQ0FFYW5DLEcsRUFBS0gsTyxFQUFRO0FBQ3ZCLGdCQUFHRyxPQUFLLElBQUwsSUFBYSxPQUFRQSxHQUFSLEtBQWlCLFdBQWpDLEVBQTZDO0FBQ3pDO0FBQ0g7QUFDRCxnQkFBSW1DLE1BQU1yQyxFQUFFRSxJQUFJb0MsTUFBTixFQUFjdEIsSUFBZCxDQUFtQixLQUFuQixDQUFWO0FBQ0EsZ0JBQUl1QixlQUFlLEtBQUtDLGVBQUwsQ0FBcUJILEdBQXJCLENBQW5CO0FBQ0FyQyxjQUFFLHNCQUFGLEVBQTBCeUMsSUFBMUIsQ0FBK0IsRUFBL0I7QUFDQXpDLGNBQUUsVUFBRixFQUFjMEMsSUFBZCxHQUFxQkQsSUFBckIsQ0FBMEIsZUFBYUYsYUFBYUksY0FBMUIsR0FBeUMsU0FBekMsR0FBbURKLGFBQWFLLElBQWhFLEdBQXFFLFdBQXJFLEdBQWlGTCxhQUFhSyxJQUE5RixHQUFtRyxPQUFuRyxHQUE0R0wsYUFBYUssSUFBekgsR0FBK0gsY0FBL0gsR0FBOElMLGFBQWFPLFNBQTNKLEdBQXFLLFNBQXJLLEdBQStLUCxhQUFhUSxnQkFBNUwsR0FBNk0sU0FBdk87QUFDSDs7OzBDQUVxQjtBQUFBLGdCQUFOVixHQUFNLHVFQUFGLENBQUU7O0FBQ2xCLGdCQUFJQSxPQUFLLENBQVQsRUFBVztBQUFFO0FBQVM7QUFDdEIsZ0JBQUlXLGFBQWEsU0FBYkEsVUFBYSxDQUFTQyxPQUFULEVBQWlCO0FBQzlCLHVCQUFPQSxRQUFRLEtBQVIsS0FBa0JaLEdBQXpCO0FBQ0gsYUFGRDtBQUdBLGdCQUFJYixTQUFTLEtBQUtFLFFBQUwsQ0FBY3dCLE1BQWQsQ0FBcUJGLFVBQXJCLENBQWI7QUFDQXpELG9CQUFRQyxHQUFSLENBQVlnQyxNQUFaO0FBQ0EsbUJBQU9BLE9BQU8sQ0FBUCxDQUFQO0FBQ0g7Ozs7OztrQkFsSGdCbEMsRyIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNob3BwaW5nQ2FydCBmcm9tICcuL1Nob3BwaW5nQ2FydCc7XG5pbXBvcnQgQkJQcm9kdWN0QVBJU2VydmljZSBmcm9tICcuL0JCUHJvZHVjdEFQSVNlcnZpY2UnO1xuaW1wb3J0IEJCUHJvZHVjdERhdGEgZnJvbSAnLi9tb2RlbC9CQlByb2R1Y3REYXRhJztcbmltcG9ydCBDYXRhbG9nIGZyb20gJy4vQ2F0YWxvZyc7IFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgYXBwJyk7XG4gICAgICAgIHRoaXMuY2FydERhdGEgPSBbXTtcbiAgICAgICAgdGhpcy5nZXRUaGVEYXRhKCk7XG4gICAgICAgIHRoaXMuY2F0YWxvZyA9IG5ldyBDYXRhbG9nKCk7XG4gICAgICAgIHRoaXMuaW5pdE1vZGFsKCk7XG4gICAgICAgIHRoaXMuc2hvcHBpbmdDYXJ0ID0gbmV3IFNob3BwaW5nQ2FydCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlTaG9wcGluZ0NhcnQoKTtcbiAgICB9XG4gICAgXG4gICAgZGlzcGxheVNob3BwaW5nQ2FydCgpe1xuICAgICAgICBjb25zb2xlLmxvZygneW91IGFyZSBpbiB0aGUgYXBwIGRpc3BsYXlTaG9wcGluZ0NhcnQgZnVuY3Rpb24nKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAkKCcjY2FydCcpLm9uKCdjbGljaycsbnVsbCx7Y29udGV4dDpjb250ZXh0fSxmdW5jdGlvbihldnQpe1xuICAgICAgICAgICAgY29udGV4dC5tb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgY29udGV4dC5zaG9wcGluZ0NhcnQuc2hvd0NhcnQoZXZ0LCBjb250ZXh0KTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgXG4gICAgaW5pdE1vZGFsKCl7XG4gICAgICAgIC8vIEdldCB0aGUgbW9kYWxcbiAgICAgICAgdGhpcy5tb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteU1vZGFsJyk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSA8c3Bhbj4gZWxlbWVudCB0aGF0IGNsb3NlcyB0aGUgbW9kYWxcbiAgICAgICAgdGhpcy5jbG9zZVNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2xvc2VcIilbMF07XG4gICAgICAgIC8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIDxzcGFuPiAoeCksIGNsb3NlIHRoZSBtb2RhbFxuICAgICAgICB0aGlzLmNsb3NlU3Bhbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKFwiI215TW9kYWxcIikuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIGFueXdoZXJlIG91dHNpZGUgb2YgdGhlIG1vZGFsLCBjbG9zZSBpdFxuICAgICAgIC8qIHdpbmRvdy5vbmNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT0gdGhpcy5tb2RhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kYWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9Ki9cbiAgICB9IFxuICAgIFxuICAgIGdldFRoZURhdGEoKXtcbiAgICAgICAgLy8gbG9hZCB0aGUgZGF0YVxuICAgICAgICB0aGlzLmJiQVBJU2VydmljZSA9IG5ldyBCQlByb2R1Y3RBUElTZXJ2aWNlOyBcbiAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICB0aGlzLnN1Y2Nlc3NDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTsgY29udGV4dC5wcm9jZXNzUmVzdWx0c0ludG9Vc2FibGVEYXRhKGNvbnRleHQuZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgdGhpcy5mYWlsQ2FsbGJhY2sgPSBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQhIFxcbicsIGVycm9yKTtcbiAgICAgICB9OyB0aGlzLmJiQVBJU2VydmljZS5sb2FkRGF0YVVzaW5nSlMoKS50aGVuKHRoaXMuc3VjY2Vzc0NhbGxiYWNrLCB0aGlzLmZhaWxDYWxsYmFjayk7XG4gICAgfVxuICAgIFxuICAgIHByb2Nlc3NSZXN1bHRzSW50b1VzYWJsZURhdGEocmVzdWx0KXtcbiAgICAgICAgLy8gZnJvbSBoZXJlLCBleHRyYWN0IG9ubHkgdGhlIHByb2R1Y3QgaW5mb1xuICAgICAgICB0aGlzLnJhd0RhdGEgPSBuZXcgQkJQcm9kdWN0RGF0YSAocmVzdWx0KTtcbiAgICAgICAgdGhpcy5wcm9kdWN0cyA9IHRoaXMucmF3RGF0YS5wcm9kdWN0cztcbiAgICAgICAgdGhpcy5jcmVhdGVUYWJsZU9mSXRlbXModGhpcy5wcm9kdWN0cyk7XG4gICAgfVxuICAgIFxuICAgIGNyZWF0ZVRhYmxlT2ZJdGVtcyhwcm9kdWN0cyl7XG4gICAgICAgIC8vIEFkZGluZyBodG1sIHRvIGZsaWNraXR5ICQoJy5wcm9kdWN0LWxpc3QnKS5mbGlja2l0eVxuICAgICAgICBcbiAgICAgICAgbGV0IHByb2R1Y3RDZWxscyA9IHRoaXMuY2F0YWxvZy5zaG93Q2F0YWxvZ1Byb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2R1Y3RMaXN0JykuaW5uZXJIVE1MID0gcHJvZHVjdENlbGxzOyBcbiAgICAgICAgXG4gICAgICAgIC8vIEFERElORyBFVkVOVCBMSVNURU5FUlMgVE8gVEhFIEJVVFRPTlNcbiAgICAgICAgZm9yIChsZXQgYnRuQ291bnQ9MDsgYnRuQ291bnQ8cHJvZHVjdHMubGVuZ3RoOyBidG5Db3VudCsrKXtcbiAgICAgICAgICAgIGxldCBjdXJyZW50SXRlbSA9IHByb2R1Y3RzW2J0bkNvdW50XTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2N1cnJlbnRJdGVtIGlzICcgKyBjdXJyZW50SXRlbVsnc2t1J10pOyBcbiAgICAgICAgICAgIGxldCBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYWRkIHRvIGNhcnRcbiAgICAgICAgICAgICQoJyMnK2N1cnJlbnRJdGVtWydza3UnXSkub24oJ2NsaWNrJywgbnVsbCwge2NvbnRleHQ6Y29udGV4dH0sIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgY29udGV4dC5wcmVwYXJlSXRlbVRvQWRkVG9DYXJ0KGV2ZW50LCBjb250ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBxdWljayB2aWV3XG4gICAgICAgICAgICAkKCcjcXVpY2tWaWV3LScrY3VycmVudEl0ZW1bJ3NrdSddKS5vbignY2xpY2snLCBudWxsLCB7Y29udGV4dDpjb250ZXh0fSwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIGNvbnRleHQubW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnNob3dRdWlja1ZpZXcoZXZlbnQsIGNvbnRleHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJlcGFyZUl0ZW1Ub0FkZFRvQ2FydChldnQsIGNvbnRleHQpe1xuICAgICAgICBpZihldnQ9PW51bGwgfHwgdHlwZW9mIChldnQpID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNrdSA9ICQoZXZ0LnRhcmdldCkuZGF0YSgnc2t1Jyk7ICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKHNrdSk7XG4gICAgICAgIGxldCBwcm9kdWN0QWRkZWQgPSB0aGlzLmdldFByb2R1Y3RCeVNrdShza3UpO1xuICAgICAgICAkKCcjc2hvcHBpbmdDYXJ0Q29udGVudCcpLmh0bWwoXCJcIik7XG4gICAgICAgICQoJyNjb250ZW50JykubGFzdCgpLmh0bWwoJzxpbWcgc3JjPVwiJytwcm9kdWN0QWRkZWQudGh1bWJuYWlsSW1hZ2UrJ1wiIGFsdD1cIicrcHJvZHVjdEFkZGVkLm5hbWUrJ1wiIHRpdGxlPVwiJytwcm9kdWN0QWRkZWQubmFtZSsnXCI+PGI+JysgcHJvZHVjdEFkZGVkLm5hbWUgKyc8L2I+PGJyPmhhcyBiZWVuIGFkZGVkIHRvIHRoZSBjYXJ0Ljxicj4nKTtcbiAgICAgICAgY29udGV4dC5zaG9wcGluZ0NhcnQuYWRkSXRlbVRvQ2FydCgxLCBza3UpO1xuICAgIH1cbiAgICBcbiAgICBzaG93UXVpY2tWaWV3KGV2dCwgY29udGV4dCl7XG4gICAgICAgIGlmKGV2dD09bnVsbCB8fCB0eXBlb2YgKGV2dCkgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2t1ID0gJChldnQudGFyZ2V0KS5kYXRhKCdza3UnKTtcbiAgICAgICAgbGV0IHByb2R1Y3RBZGRlZCA9IHRoaXMuZ2V0UHJvZHVjdEJ5U2t1KHNrdSk7XG4gICAgICAgICQoJyNzaG9wcGluZ0NhcnRDb250ZW50JykuaHRtbChcIlwiKTtcbiAgICAgICAgJCgnI2NvbnRlbnQnKS5sYXN0KCkuaHRtbCgnPGltZyBzcmM9XCInK3Byb2R1Y3RBZGRlZC50aHVtYm5haWxJbWFnZSsnXCIgYWx0PVwiJytwcm9kdWN0QWRkZWQubmFtZSsnXCIgdGl0bGU9XCInK3Byb2R1Y3RBZGRlZC5uYW1lKydcIj48Yj4nKyBwcm9kdWN0QWRkZWQubmFtZSArJzwvYj48YnI+PGI+JCcrcHJvZHVjdEFkZGVkLnNhbGVQcmljZSsnPC9iPjxwPicrcHJvZHVjdEFkZGVkLnNob3J0RGVzY3JpcHRpb24rJzxwPjxicj4nKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UHJvZHVjdEJ5U2t1KHNrdT0wKXtcbiAgICAgICAgaWYgKHNrdT09MCl7IHJldHVybjsgfTtcbiAgICAgICAgbGV0IGNyaXRlcmlhRm4gPSBmdW5jdGlvbihwcm9kdWN0KXtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0Wydza3UnXSA9PSBza3U7XG4gICAgICAgIH07XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLnByb2R1Y3RzLmZpbHRlcihjcml0ZXJpYUZuKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFswXTtcbiAgICB9ICAgXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvQXBwLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar ShoppingCart = function () {\n    function ShoppingCart() {\n        _classCallCheck(this, ShoppingCart);\n\n        // initialize the shopping cart\n        this.ss = null;\n        this.initializeCart();\n    }\n\n    _createClass(ShoppingCart, [{\n        key: 'initializeCart',\n        value: function initializeCart() {\n            if ((typeof Storage === 'undefined' ? 'undefined' : _typeof(Storage)) != undefined) {\n                this.ss = sessionStorage;\n            } else {\n                console.log('Cody says you need a new browser! boo');\n                return;\n            }\n        }\n    }, {\n        key: 'addItemToCart',\n        value: function addItemToCart() {\n            var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n            var item = arguments[1];\n\n            if (this.ss == null) {\n                return;\n            };\n            if (qty <= 0) {\n                return;\n            }\n            if (item == null || typeof item == 'undefined') {\n                return;\n            }\n\n            //console.log('the # of items in storage session is ' + this.ss.length);\n            var numberOfItemsInCart = this.ss.length;\n\n            // case: we're the 1st product\n            if (numberOfItemsInCart == 0) {\n                this.ss.setItem(item.toString(), qty.toString());\n                return;\n            } else {\n                var numMatches = 0;\n                for (var theKey in this.ss) {\n                    console.log('the Key =' + theKey);\n                    if (theKey == item.toString()) {\n                        // update quantity value;\n                        var newValue = (parseInt(this.ss.getItem(theKey)) + parseInt(qty)).toString();\n                        this.ss.setItem(theKey, newValue);\n                        numMatches = 1;\n                    } else {\n                        console.log('no match');\n                    }\n                }\n                if (numMatches == 0) {\n                    this.ss.setItem(item.toString(), qty.toString());\n                }\n            }\n        }\n    }, {\n        key: 'deleteItemFromCart',\n        value: function deleteItemFromCart() {\n            var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n            var item = arguments[1];\n\n            if (this.ss == null) {\n                return;\n            };\n            if (qty <= 0) {\n                return;\n            }\n            if (item == null || typeof item == 'undefined') {\n                return;\n            }\n            // check for ss\n\n            var numberOfItemsInCart = this.ss.length;\n            if (numberOfItemsInCart == 0) {\n                return;\n            }\n            // check that there are items\n            var numMatches = 0;\n            for (var theKey in this.ss) {\n                if (theKey == item.toString()) {\n                    // update quantity value;\n                    var newValue = (parseInt(this.ss.getItem(theKey)) - parseInt(qty)).toString();\n                    this.ss.setItem(theKey, newValue.toString());\n                    numMatches = 1;\n                    // update the input value\n                    var currentInputValue = $('#input-' + theKey).attr('value');\n                    currentInputValue = currentInputValue - 1;\n                    $('#input-' + theKey).attr('value', currentInputValue);\n                    $('#input-' + theKey).val(currentInputValue);\n                    if (newValue == 0) {\n                        this.ss.removeItem(theKey);\n                        $('#input-' + theKey).parent().remove();\n                        break;\n                        //return;\n                    }\n                } else {\n                    console.log('no match');\n                }\n            }\n            if (numMatches == 0) {\n                return;\n            }\n        }\n    }, {\n        key: 'updateCart',\n        value: function updateCart(localCart, context) {\n            console.log('you are in the update cart button function');\n            for (var i = 0; i < localCart.length; i++) {\n                var currentProduct = new Object(localCart[i]);\n                console.log('currentProduct: ' + currentProduct);\n                //let currentProduct = localCart[i];\n                var itemSku = currentProduct['sku'];\n                console.log('itemSku: ' + itemSku);\n                //let itemSku = currentProduct.sku; *\n                var newQty = currentProduct['qty'];\n                console.log('quantity: ' + newQty);\n                for (var theKey in context.shoppingCart.ss) {\n                    if (theKey == itemSku) {\n                        context.shoppingCart.ss.setItem(itemSku, newQty);\n                    } else {\n                        console.log('not a match');\n                    }\n                }\n            }\n        }\n    }, {\n        key: 'showCart',\n        value: function showCart(evt, context) {\n            var _this = this;\n\n            //console.log('you made it to the shopping cart!');\n            $('#content').html(\"\");\n            var cartContent = \"\";\n            var cartQty = this.ss.length;\n            //console.log('cart-Qty: '+cartQty);\n            if (this.ss == null || cartQty <= 0) {\n                cartContent = \"<li><b>You have no items in the shopping cart.</b></li>\";\n            } else {\n                (function () {\n                    var setUpLocalCart = function setUpLocalCart() {\n                        var counter = 0;\n                        console.log(context.shoppingCart.ss);\n                        for (var _theKey in context.shoppingCart.ss) {\n                            var qty = context.shoppingCart.ss.getItem(_theKey);\n                            localCart[counter] = { 'sku': _theKey, 'qty': qty };\n                            counter++;\n                        }\n                        return localCart;\n                    };\n                    //console.log(localCart);\n\n                    // ADDING EVENT HANDLERS\n\n\n                    cartContent = \"<h1>Shopping Cart</h1>\";\n\n                    var _loop = function _loop(theKey) {\n                        var criteriaFn = function criteriaFn(product) {\n                            return product['sku'] == theKey;\n                        };\n                        var result = context.products.filter(criteriaFn);\n                        console.log(result);\n                        var qty = parseInt(_this.ss.getItem(theKey));\n                        console.log(qty);\n                        cartContent += \"<li><img src='\" + result[0].thumbnailImage + \"' alt='\" + result[0].name + \"' title='\" + result[0].name + \"'><h2 class='prodName'>\" + result[0].name + \"</h2><p>$\" + result[0].salePrice + \"</p><input id='input-\" + result[0].sku + \"' data-sku='\" + result[0].sku + \"'type='number' value='\" + qty + \"'><button id='delete-\" + result[0].sku + \"' data-sku='\" + result[0].sku + \"'>Remove Item</button></li>\";\n                    };\n\n                    for (var theKey in _this.ss) {\n                        _loop(theKey);\n                    }\n                    $('#shoppingCartContent').append(cartContent);\n\n                    // SET UP LOCAL CART\n                    var localCart = [];\n                    localCart = setUpLocalCart();\n\n                    var _loop2 = function _loop2(btnCount) {\n                        var currentItem = context.products[btnCount];\n                        // DELETE BUTTONS\n                        $(\"#delete-\" + currentItem['sku']).on('click', null, {}, function (event) {\n                            var item = $(\"#delete-\" + currentItem['sku']).data('sku');\n                            context.shoppingCart.deleteItemFromCart(1, item);\n                        });\n                        // TEXT FIELDS\n                        $('#input-' + currentItem['sku']).on('change', function (evt) {\n                            //console.log(\"you changed something\");\n                            var targetSku = $(evt.target).data('sku');\n                            var grabbedValue = $(this).val();\n                            //console.log(grabbedValue);\n\n                            for (var iCount = 0; iCount < localCart.length; iCount++) {\n                                var localCartItem = localCart[iCount];\n                                if (localCartItem.sku == targetSku) {\n                                    localCartItem.qty = grabbedValue;\n                                }\n                            }\n                            console.log(localCart);\n                        });\n                    };\n\n                    for (var btnCount = 0; btnCount < context.products.length; btnCount++) {\n                        _loop2(btnCount);\n                    }\n                    var updateBtn = \"<button id='updateBtn'>Update Cart</button><button>Checkout</button>\";\n                    $('#shoppingCartContent').append(updateBtn);\n                    $('#updateBtn').on('click', null, { localCart: localCart }, function (event) {\n                        context.shoppingCart.updateCart(event.data.localCart, context);\n                    });\n                })();\n            }\n        }\n    }]);\n\n    return ShoppingCart;\n}();\n\nexports.default = ShoppingCart;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU2hvcHBpbmdDYXJ0LmpzPzc5MWEiXSwibmFtZXMiOlsiU2hvcHBpbmdDYXJ0Iiwic3MiLCJpbml0aWFsaXplQ2FydCIsIlN0b3JhZ2UiLCJ1bmRlZmluZWQiLCJzZXNzaW9uU3RvcmFnZSIsImNvbnNvbGUiLCJsb2ciLCJxdHkiLCJpdGVtIiwibnVtYmVyT2ZJdGVtc0luQ2FydCIsImxlbmd0aCIsInNldEl0ZW0iLCJ0b1N0cmluZyIsIm51bU1hdGNoZXMiLCJ0aGVLZXkiLCJuZXdWYWx1ZSIsInBhcnNlSW50IiwiZ2V0SXRlbSIsImN1cnJlbnRJbnB1dFZhbHVlIiwiJCIsImF0dHIiLCJ2YWwiLCJyZW1vdmVJdGVtIiwicGFyZW50IiwicmVtb3ZlIiwibG9jYWxDYXJ0IiwiY29udGV4dCIsImkiLCJjdXJyZW50UHJvZHVjdCIsIk9iamVjdCIsIml0ZW1Ta3UiLCJuZXdRdHkiLCJzaG9wcGluZ0NhcnQiLCJldnQiLCJodG1sIiwiY2FydENvbnRlbnQiLCJjYXJ0UXR5Iiwic2V0VXBMb2NhbENhcnQiLCJjb3VudGVyIiwiY3JpdGVyaWFGbiIsInByb2R1Y3QiLCJyZXN1bHQiLCJwcm9kdWN0cyIsImZpbHRlciIsInRodW1ibmFpbEltYWdlIiwibmFtZSIsInNhbGVQcmljZSIsInNrdSIsImFwcGVuZCIsImJ0bkNvdW50IiwiY3VycmVudEl0ZW0iLCJvbiIsImV2ZW50IiwiZGF0YSIsImRlbGV0ZUl0ZW1Gcm9tQ2FydCIsInRhcmdldFNrdSIsInRhcmdldCIsImdyYWJiZWRWYWx1ZSIsImlDb3VudCIsImxvY2FsQ2FydEl0ZW0iLCJ1cGRhdGVCdG4iLCJ1cGRhdGVDYXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBcUJBLFk7QUFDakIsNEJBQWE7QUFBQTs7QUFDVDtBQUNBLGFBQUtDLEVBQUwsR0FBVSxJQUFWO0FBQ0EsYUFBS0MsY0FBTDtBQUNIOzs7O3lDQUVpQjtBQUNkLGdCQUFJLFFBQVFDLE9BQVIseUNBQVFB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Ozs7OztrQkF6S2dCM0IsWSIsImZpbGUiOiIyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hvcHBpbmdDYXJ0IHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBzaG9wcGluZyBjYXJ0XG4gICAgICAgIHRoaXMuc3MgPSBudWxsO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVDYXJ0KClcbiAgICB9XG4gICAgXG4gICAgaW5pdGlhbGl6ZUNhcnQgKCkge1xuICAgICAgICBpZiAodHlwZW9mIChTdG9yYWdlKSAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdGhpcy5zcz0gc2Vzc2lvblN0b3JhZ2U7XG4gICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvZHkgc2F5cyB5b3UgbmVlZCBhIG5ldyBicm93c2VyISBib28nKTtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGFkZEl0ZW1Ub0NhcnQocXR5PTAsIGl0ZW0pe1xuICAgICAgICBpZiAodGhpcy5zcyA9PSBudWxsICkge3JldHVybn07XG4gICAgICAgIGlmIChxdHk8PTApIHtyZXR1cm47fVxuICAgICAgICBpZiAoaXRlbSA9PSBudWxsIHx8IHR5cGVvZiAoaXRlbSk9PSd1bmRlZmluZWQnKSB7cmV0dXJuO31cbiAgICAgICAgXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RoZSAjIG9mIGl0ZW1zIGluIHN0b3JhZ2Ugc2Vzc2lvbiBpcyAnICsgdGhpcy5zcy5sZW5ndGgpO1xuICAgICAgICBsZXQgbnVtYmVyT2ZJdGVtc0luQ2FydCA9IHRoaXMuc3MubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgLy8gY2FzZTogd2UncmUgdGhlIDFzdCBwcm9kdWN0XG4gICAgICAgIGlmIChudW1iZXJPZkl0ZW1zSW5DYXJ0ID09IDApe1xuICAgICAgICAgICAgdGhpcy5zcy5zZXRJdGVtKGl0ZW0udG9TdHJpbmcoKSwgcXR5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG51bU1hdGNoZXMgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgdGhlS2V5IGluIHRoaXMuc3MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhlIEtleSA9JyArIHRoZUtleSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoZUtleSA9PSBpdGVtLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIHF1YW50aXR5IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSAocGFyc2VJbnQodGhpcy5zcy5nZXRJdGVtKHRoZUtleSkpICsgcGFyc2VJbnQocXR5KSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcy5zZXRJdGVtKHRoZUtleSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBudW1NYXRjaGVzID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbWF0Y2gnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobnVtTWF0Y2hlcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcy5zZXRJdGVtKGl0ZW0udG9TdHJpbmcoKSwgcXR5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGRlbGV0ZUl0ZW1Gcm9tQ2FydChxdHk9MCwgaXRlbSl7ICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuc3MgPT0gbnVsbCApIHtyZXR1cm59O1xuICAgICAgICBpZiAocXR5PD0wKSB7cmV0dXJuO31cbiAgICAgICAgaWYgKGl0ZW0gPT0gbnVsbCB8fCB0eXBlb2YgKGl0ZW0pPT0ndW5kZWZpbmVkJykge3JldHVybjt9XG4gICAgICAgIC8vIGNoZWNrIGZvciBzc1xuICAgICAgICBcbiAgICAgICAgbGV0IG51bWJlck9mSXRlbXNJbkNhcnQgPSB0aGlzLnNzLmxlbmd0aDtcbiAgICAgICAgaWYgKG51bWJlck9mSXRlbXNJbkNhcnQgPT0gMCkge3JldHVybjt9XG4gICAgICAgIC8vIGNoZWNrIHRoYXQgdGhlcmUgYXJlIGl0ZW1zXG4gICAgICAgIGxldCBudW1NYXRjaGVzID0gMDtcbiAgICAgICAgZm9yIChsZXQgdGhlS2V5IGluIHRoaXMuc3Mpe1xuICAgICAgICAgICAgaWYgKHRoZUtleSA9PSBpdGVtLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgcXVhbnRpdHkgdmFsdWU7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gKHBhcnNlSW50KHRoaXMuc3MuZ2V0SXRlbSh0aGVLZXkpKSAtIHBhcnNlSW50KHF0eSkpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zcy5zZXRJdGVtKHRoZUtleSwgbmV3VmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgbnVtTWF0Y2hlcyA9IDE7IFxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgaW5wdXQgdmFsdWVcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudElucHV0VmFsdWUgPSAkKCcjaW5wdXQtJyt0aGVLZXkpLmF0dHIoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgY3VycmVudElucHV0VmFsdWUgPSBjdXJyZW50SW5wdXRWYWx1ZSAtIDE7XG4gICAgICAgICAgICAgICAgJCgnI2lucHV0LScrdGhlS2V5KS5hdHRyKCd2YWx1ZScsY3VycmVudElucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgICQoJyNpbnB1dC0nK3RoZUtleSkudmFsKGN1cnJlbnRJbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3MucmVtb3ZlSXRlbSh0aGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaW5wdXQtJyt0aGVLZXkpLnBhcmVudCgpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbWF0Y2gnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobnVtTWF0Y2hlcyA9PSAwKSB7cmV0dXJuO31cbiAgICB9XG4gICAgXG4gICAgdXBkYXRlQ2FydChsb2NhbENhcnQsIGNvbnRleHQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3lvdSBhcmUgaW4gdGhlIHVwZGF0ZSBjYXJ0IGJ1dHRvbiBmdW5jdGlvbicpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bG9jYWxDYXJ0Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGxldCBjdXJyZW50UHJvZHVjdCA9IG5ldyBPYmplY3QoIGxvY2FsQ2FydFtpXSApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2N1cnJlbnRQcm9kdWN0OiAnK2N1cnJlbnRQcm9kdWN0KTtcbiAgICAgICAgICAgIC8vbGV0IGN1cnJlbnRQcm9kdWN0ID0gbG9jYWxDYXJ0W2ldO1xuICAgICAgICAgICAgbGV0IGl0ZW1Ta3UgPSBjdXJyZW50UHJvZHVjdFsnc2t1J107XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaXRlbVNrdTogJytpdGVtU2t1KTtcbiAgICAgICAgICAgIC8vbGV0IGl0ZW1Ta3UgPSBjdXJyZW50UHJvZHVjdC5za3U7ICpcbiAgICAgICAgICAgIGxldCBuZXdRdHkgPSBjdXJyZW50UHJvZHVjdFsncXR5J107XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncXVhbnRpdHk6ICcrbmV3UXR5KTtcbiAgICAgICAgICAgIGZvciAobGV0IHRoZUtleSBpbiBjb250ZXh0LnNob3BwaW5nQ2FydC5zcyl7XG4gICAgICAgICAgICAgICAgaWYgKHRoZUtleSA9PSBpdGVtU2t1KXtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zaG9wcGluZ0NhcnQuc3Muc2V0SXRlbShpdGVtU2t1LCBuZXdRdHkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgYSBtYXRjaCcpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gICBcbiAgICB9ICBcblxuICAgIHNob3dDYXJ0KGV2dCwgY29udGV4dCl7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3lvdSBtYWRlIGl0IHRvIHRoZSBzaG9wcGluZyBjYXJ0IScpO1xuICAgICAgICAkKCcjY29udGVudCcpLmh0bWwoXCJcIik7XG4gICAgICAgIGxldCBjYXJ0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIGxldCBjYXJ0UXR5ID0gdGhpcy5zcy5sZW5ndGg7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NhcnQtUXR5OiAnK2NhcnRRdHkpO1xuICAgICAgICBpZiAodGhpcy5zcyA9PSBudWxsIHx8IGNhcnRRdHk8PTApIHtcbiAgICAgICAgICAgIGNhcnRDb250ZW50ID0gXCI8bGk+PGI+WW91IGhhdmUgbm8gaXRlbXMgaW4gdGhlIHNob3BwaW5nIGNhcnQuPC9iPjwvbGk+XCI7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGNhcnRDb250ZW50ID0gXCI8aDE+U2hvcHBpbmcgQ2FydDwvaDE+XCI7XG4gICAgICAgICAgICBmb3IobGV0IHRoZUtleSBpbiB0aGlzLnNzKXtcbiAgICAgICAgICAgICAgICBsZXQgY3JpdGVyaWFGbiA9IGZ1bmN0aW9uKHByb2R1Y3Qpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdFsnc2t1J10gPT0gdGhlS2V5O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGNvbnRleHQucHJvZHVjdHMuZmlsdGVyKGNyaXRlcmlhRm4pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgbGV0IHF0eSA9IHBhcnNlSW50KHRoaXMuc3MuZ2V0SXRlbSh0aGVLZXkpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhxdHkpO1xuICAgICAgICAgICAgICAgIGNhcnRDb250ZW50ICs9IFwiPGxpPjxpbWcgc3JjPSdcIityZXN1bHRbMF0udGh1bWJuYWlsSW1hZ2UrXCInIGFsdD0nXCIrcmVzdWx0WzBdLm5hbWUrXCInIHRpdGxlPSdcIityZXN1bHRbMF0ubmFtZStcIic+PGgyIGNsYXNzPSdwcm9kTmFtZSc+XCIrcmVzdWx0WzBdLm5hbWUrXCI8L2gyPjxwPiRcIityZXN1bHRbMF0uc2FsZVByaWNlK1wiPC9wPjxpbnB1dCBpZD0naW5wdXQtXCIrcmVzdWx0WzBdLnNrdStcIicgZGF0YS1za3U9J1wiK3Jlc3VsdFswXS5za3UrXCIndHlwZT0nbnVtYmVyJyB2YWx1ZT0nXCIrcXR5K1wiJz48YnV0dG9uIGlkPSdkZWxldGUtXCIrcmVzdWx0WzBdLnNrdStcIicgZGF0YS1za3U9J1wiK3Jlc3VsdFswXS5za3UrXCInPlJlbW92ZSBJdGVtPC9idXR0b24+PC9saT5cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnI3Nob3BwaW5nQ2FydENvbnRlbnQnKS5hcHBlbmQoY2FydENvbnRlbnQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBTRVQgVVAgTE9DQUwgQ0FSVFxuICAgICAgICAgICAgbGV0IGxvY2FsQ2FydCA9IFtdO1xuICAgICAgICAgICAgbG9jYWxDYXJ0ID0gc2V0VXBMb2NhbENhcnQoKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldFVwTG9jYWxDYXJ0KCl7XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbnRleHQuc2hvcHBpbmdDYXJ0LnNzKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0aGVLZXkgaW4gY29udGV4dC5zaG9wcGluZ0NhcnQuc3Mpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcXR5ID0gY29udGV4dC5zaG9wcGluZ0NhcnQuc3MuZ2V0SXRlbSh0aGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbENhcnRbY291bnRlcl0gPSB7J3NrdSc6IHRoZUtleSwgJ3F0eSc6IHF0eX07XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxDYXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhsb2NhbENhcnQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBBRERJTkcgRVZFTlQgSEFORExFUlNcbiAgICAgICAgICAgIGZvcihsZXQgYnRuQ291bnQ9MDsgYnRuQ291bnQ8Y29udGV4dC5wcm9kdWN0cy5sZW5ndGg7IGJ0bkNvdW50Kyspe1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SXRlbSA9IGNvbnRleHQucHJvZHVjdHNbYnRuQ291bnRdO1xuICAgICAgICAgICAgICAgIC8vIERFTEVURSBCVVRUT05TXG4gICAgICAgICAgICAgICAgJChcIiNkZWxldGUtXCIrY3VycmVudEl0ZW1bJ3NrdSddKS5vbignY2xpY2snLG51bGwse30sZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9ICQoXCIjZGVsZXRlLVwiK2N1cnJlbnRJdGVtWydza3UnXSkuZGF0YSgnc2t1Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc2hvcHBpbmdDYXJ0LmRlbGV0ZUl0ZW1Gcm9tQ2FydCgxLCBpdGVtKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC8vIFRFWFQgRklFTERTXG4gICAgICAgICAgICAgICAgJCgnI2lucHV0LScrY3VycmVudEl0ZW1bJ3NrdSddKS5vbignY2hhbmdlJyxmdW5jdGlvbihldnQpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwieW91IGNoYW5nZWQgc29tZXRoaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0U2t1ID0gJChldnQudGFyZ2V0KS5kYXRhKCdza3UnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGdyYWJiZWRWYWx1ZSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZ3JhYmJlZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpQ291bnQ9MDsgaUNvdW50PGxvY2FsQ2FydC5sZW5ndGg7IGlDb3VudCsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbENhcnRJdGVtID0gbG9jYWxDYXJ0W2lDb3VudF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxDYXJ0SXRlbS5za3UgPT0gdGFyZ2V0U2t1KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbENhcnRJdGVtLnF0eSA9IGdyYWJiZWRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobG9jYWxDYXJ0KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHVwZGF0ZUJ0biA9IFwiPGJ1dHRvbiBpZD0ndXBkYXRlQnRuJz5VcGRhdGUgQ2FydDwvYnV0dG9uPjxidXR0b24+Q2hlY2tvdXQ8L2J1dHRvbj5cIjtcbiAgICAgICAgICAgICQoJyNzaG9wcGluZ0NhcnRDb250ZW50JykuYXBwZW5kKHVwZGF0ZUJ0bik7XG4gICAgICAgICAgICAkKCcjdXBkYXRlQnRuJykub24oJ2NsaWNrJyxudWxsLHtsb2NhbENhcnQ6bG9jYWxDYXJ0fSAsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc2hvcHBpbmdDYXJ0LnVwZGF0ZUNhcnQoZXZlbnQuZGF0YS5sb2NhbENhcnQsIGNvbnRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9TaG9wcGluZ0NhcnQuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar BBProductAPIService = function () {\n    function BBProductAPIService() {\n        _classCallCheck(this, BBProductAPIService);\n\n        this.bbURL = \"https://api.remix.bestbuy.com/v1/products((categoryPath.id=abcat0501000))?apiKey=8ccddf4rtjz5k5btqam84qak&format=json&show=image,thumbnailImage,shortDescription,name,regularPrice,salePrice,sku\";\n    }\n\n    _createClass(BBProductAPIService, [{\n        key: 'loadDataUsingJS',\n        value: function loadDataUsingJS() {\n            var _this = this;\n\n            var _promiseFn = function _promiseFn(_success, _reject) {\n                var request = new XMLHttpRequest();\n                request.onload = function () {\n                    switch (request.status) {\n                        case 200:\n                            _success(request.response);\n                            break;\n                        case 404:\n                            console.log('error: service url not found');\n                            _reject(Error(request.statusText));\n                            break;\n                        default:\n                            _reject(Error(request.statusText));\n                            break;\n                    }\n                };\n                // Handle network errors\n                request.onerror = function () {\n                    _reject(Error('Network Error'));\n                };\n                request.open('GET', _this.bbURL);\n                request.send();\n            };\n            var promise = new Promise(_promiseFn);\n            return promise;\n        }\n    }]);\n\n    return BBProductAPIService;\n}();\n\nexports.default = BBProductAPIService;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQkJQcm9kdWN0QVBJU2VydmljZS5qcz83MDQ4Il0sIm5hbWVzIjpbIkJCUHJvZHVjdEFQSVNlcnZpY2UiLCJiYlVSTCIsIl9wcm9taXNlRm4iLCJfc3VjY2VzcyIsIl9yZWplY3QiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvbmxvYWQiLCJzdGF0dXMiLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJFcnJvciIsInN0YXR1c1RleHQiLCJvbmVycm9yIiwib3BlbiIsInNlbmQiLCJwcm9taXNlIiwiUHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFxQkEsbUI7QUFDakIsbUNBQWE7QUFBQTs7QUFDVCxhQUFLQyxLQUFMLEdBQWEsa01BQWI7QUFDSDs7OzswQ0FFZ0I7QUFBQTs7QUFDYixnQkFBSUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLFFBQUQsRUFBV0MsT0FBWCxFQUF1QjtBQUNwQyxvQkFBSUMsVUFBVSxJQUFJQyxjQUFKLEVBQWQ7QUFDQUQsd0JBQVFFLE1BQVIsR0FBaUIsWUFBTTtBQUNuQiw0QkFBT0YsUUFBUUcsTUFBZjtBQUNJLDZCQUFLLEdBQUw7QUFDSUwscUNBQVNFLFFBQVFJLFFBQWpCO0FBQ0E7QUFDSiw2QkFBSyxHQUFMO0FBQ0lDLG9DQUFRQyxHQUFSLENBQVksOEJBQVo7QUFDQVAsb0NBQVFRLE1BQU1QLFFBQVFRLFVBQWQsQ0FBUjtBQUNBO0FBQ0o7QUFDSVQsb0NBQVFRLE1BQU1QLFFBQVFRLFVBQWQsQ0FBUjtBQUNBO0FBVlI7QUFZSCxpQkFiRDtBQWNBO0FBQ0FSLHdCQUFRUyxPQUFSLEdBQWtCLFlBQVk7QUFDMUJWLDRCQUFRUSxNQUFNLGVBQU4sQ0FBUjtBQUNILGlCQUZEO0FBR0FQLHdCQUFRVSxJQUFSLENBQWEsS0FBYixFQUFvQixNQUFLZCxLQUF6QjtBQUNBSSx3QkFBUVcsSUFBUjtBQUNILGFBdEJEO0FBdUJBLGdCQUFJQyxVQUFVLElBQUlDLE9BQUosQ0FBWWhCLFVBQVosQ0FBZDtBQUNBLG1CQUFPZSxPQUFQO0FBQ0g7Ozs7OztrQkEvQmdCakIsbUIiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJCUHJvZHVjdEFQSVNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuYmJVUkwgPSBcImh0dHBzOi8vYXBpLnJlbWl4LmJlc3RidXkuY29tL3YxL3Byb2R1Y3RzKChjYXRlZ29yeVBhdGguaWQ9YWJjYXQwNTAxMDAwKSk/YXBpS2V5PThjY2RkZjRydGp6NWs1YnRxYW04NHFhayZmb3JtYXQ9anNvbiZzaG93PWltYWdlLHRodW1ibmFpbEltYWdlLHNob3J0RGVzY3JpcHRpb24sbmFtZSxyZWd1bGFyUHJpY2Usc2FsZVByaWNlLHNrdVwiO1xuICAgIH1cbiAgICBcbiAgICBsb2FkRGF0YVVzaW5nSlMoKXtcbiAgICAgICAgbGV0IF9wcm9taXNlRm4gPSAoX3N1Y2Nlc3MsIF9yZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2gocmVxdWVzdC5zdGF0dXMpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zdWNjZXNzKHJlcXVlc3QucmVzcG9uc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQwNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogc2VydmljZSB1cmwgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVqZWN0KEVycm9yKHJlcXVlc3Quc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlamVjdChFcnJvcihyZXF1ZXN0LnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBuZXR3b3JrIGVycm9yc1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9yZWplY3QoRXJyb3IoJ05ldHdvcmsgRXJyb3InKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHRoaXMuYmJVUkwpO1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShfcHJvbWlzZUZuKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIFxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL0JCUHJvZHVjdEFQSVNlcnZpY2UuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar BBProductData = function BBProductData(data) {\n    _classCallCheck(this, BBProductData);\n\n    this.from = data['from'];\n    this.to = data['to'];\n    this.total = data['total'];\n    this.currentPage = data['currentPage'];\n    this.totalPages = data['totalPages'];\n    this.queryTime = data['queryTime'];\n    this.totalTime = data['totalTime'];\n    this.partial = data['partial'];\n    this.canonicalUrl = data['canonicalUrl'];\n    this.products = data['products'];\n};\n\nexports.default = BBProductData;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvQkJQcm9kdWN0RGF0YS5qcz84NWZhIl0sIm5hbWVzIjpbIkJCUHJvZHVjdERhdGEiLCJkYXRhIiwiZnJvbSIsInRvIiwidG90YWwiLCJjdXJyZW50UGFnZSIsInRvdGFsUGFnZXMiLCJxdWVyeVRpbWUiLCJ0b3RhbFRpbWUiLCJwYXJ0aWFsIiwiY2Fub25pY2FsVXJsIiwicHJvZHVjdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQXFCQSxhLEdBQ2pCLHVCQUFhQyxJQUFiLEVBQW1CO0FBQUE7O0FBQ2YsU0FBS0MsSUFBTCxHQUFZRCxLQUFLLE1BQUwsQ0FBWjtBQUNBLFNBQUtFLEVBQUwsR0FBVUYsS0FBSyxJQUFMLENBQVY7QUFDQSxTQUFLRyxLQUFMLEdBQWFILEtBQUssT0FBTCxDQUFiO0FBQ0EsU0FBS0ksV0FBTCxHQUFtQkosS0FBSyxhQUFMLENBQW5CO0FBQ0EsU0FBS0ssVUFBTCxHQUFrQkwsS0FBSyxZQUFMLENBQWxCO0FBQ0EsU0FBS00sU0FBTCxHQUFpQk4sS0FBSyxXQUFMLENBQWpCO0FBQ0EsU0FBS08sU0FBTCxHQUFpQlAsS0FBSyxXQUFMLENBQWpCO0FBQ0EsU0FBS1EsT0FBTCxHQUFlUixLQUFLLFNBQUwsQ0FBZjtBQUNBLFNBQUtTLFlBQUwsR0FBb0JULEtBQUssY0FBTCxDQUFwQjtBQUNBLFNBQUtVLFFBQUwsR0FBZ0JWLEtBQUssVUFBTCxDQUFoQjtBQUNILEM7O2tCQVpnQkQsYSIsImZpbGUiOiI0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQkJQcm9kdWN0RGF0YSB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICAgICAgdGhpcy5mcm9tID0gZGF0YVsnZnJvbSddO1xuICAgICAgICB0aGlzLnRvID0gZGF0YVsndG8nXTtcbiAgICAgICAgdGhpcy50b3RhbCA9IGRhdGFbJ3RvdGFsJ107XG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBkYXRhWydjdXJyZW50UGFnZSddO1xuICAgICAgICB0aGlzLnRvdGFsUGFnZXMgPSBkYXRhWyd0b3RhbFBhZ2VzJ107XG4gICAgICAgIHRoaXMucXVlcnlUaW1lID0gZGF0YVsncXVlcnlUaW1lJ107XG4gICAgICAgIHRoaXMudG90YWxUaW1lID0gZGF0YVsndG90YWxUaW1lJ107XG4gICAgICAgIHRoaXMucGFydGlhbCA9IGRhdGFbJ3BhcnRpYWwnXTtcbiAgICAgICAgdGhpcy5jYW5vbmljYWxVcmwgPSBkYXRhWydjYW5vbmljYWxVcmwnXTtcbiAgICAgICAgdGhpcy5wcm9kdWN0cyA9IGRhdGFbJ3Byb2R1Y3RzJ107XG4gICAgfVxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21vZGVsL0JCUHJvZHVjdERhdGEuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Catalog = function () {\n    function Catalog() {\n        //\n\n        _classCallCheck(this, Catalog);\n    }\n\n    _createClass(Catalog, [{\n        key: 'showCatalogProducts',\n        value: function showCatalogProducts(products) {\n            console.log('createTableOfItems();');\n            var productCell = \"\";\n            // count the number of products (should be 10)\n            for (var itemCount = 0; itemCount < products.length; itemCount++) {\n                console.log('in for loop');\n                // produce a \"table\" of items\n                var currentItem = products[itemCount];\n                productCell += '<div class=\"product-wrapper\" style=\"position: absolute; left:' + itemCount * 530 + '\" >';\n                productCell += '<img src=\"' + currentItem[\"image\"] + '\" alt=\"' + currentItem[\"name\"] + '\" title=\"' + currentItem[\"name\"] + '\" height=\"250\" width=\"250\">';\n                productCell += '<p>' + currentItem[\"name\"] + '<br>' + currentItem[\"salePrice\"] + '</p>';\n                productCell += '<button type=\\'button\\' id=\\'quickView-' + currentItem['sku'] + '\\' data-sku=\\'' + currentItem['sku'] + '\\'>Quick View</button>';\n                productCell += '<button type=\\'button\\' id=\\'' + currentItem['sku'] + '\\' data-sku=\\'' + currentItem['sku'] + '\\'>Add To Cart</button>';\n                productCell += '</div>';\n                productCell += '\\n';\n            }\n            return productCell;\n        }\n    }]);\n\n    return Catalog;\n}();\n\nexports.default = Catalog;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQ2F0YWxvZy5qcz82Yzk4Il0sIm5hbWVzIjpbIkNhdGFsb2ciLCJwcm9kdWN0cyIsImNvbnNvbGUiLCJsb2ciLCJwcm9kdWN0Q2VsbCIsIml0ZW1Db3VudCIsImxlbmd0aCIsImN1cnJlbnRJdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxPO0FBQ2pCLHVCQUFhO0FBQ1Q7O0FBRFM7QUFFWjs7Ozs0Q0FFbUJDLFEsRUFBUztBQUN6QkMsb0JBQVFDLEdBQVIsQ0FBWSx1QkFBWjtBQUNBLGdCQUFJQyxjQUFhLEVBQWpCO0FBQ0E7QUFDQSxpQkFBSyxJQUFJQyxZQUFVLENBQW5CLEVBQXNCQSxZQUFVSixTQUFTSyxNQUF6QyxFQUFpREQsV0FBakQsRUFBNkQ7QUFDekRILHdCQUFRQyxHQUFSLENBQVksYUFBWjtBQUNBO0FBQ0Esb0JBQUlJLGNBQWNOLFNBQVNJLFNBQVQsQ0FBbEI7QUFDQUQsK0JBQWUsa0VBQWdFQyxZQUFVLEdBQTFFLEdBQThFLEtBQTdGO0FBQ0FELCtCQUFlLGVBQWFHLFlBQVksT0FBWixDQUFiLEdBQWtDLFNBQWxDLEdBQTRDQSxZQUFZLE1BQVosQ0FBNUMsR0FBZ0UsV0FBaEUsR0FBNEVBLFlBQVksTUFBWixDQUE1RSxHQUFnRyw2QkFBL0c7QUFDQUgsK0JBQWUsUUFBTUcsWUFBWSxNQUFaLENBQU4sR0FBMEIsTUFBMUIsR0FBaUNBLFlBQVksV0FBWixDQUFqQyxHQUEwRCxNQUF6RTtBQUNBSCwrQkFBZSw0Q0FBd0NHLFlBQVksS0FBWixDQUF4QyxzQkFBOEVBLFlBQVksS0FBWixDQUE5RSwyQkFBZjtBQUNBSCwrQkFBZSxrQ0FBOEJHLFlBQVksS0FBWixDQUE5QixzQkFBb0VBLFlBQVksS0FBWixDQUFwRSw0QkFBZjtBQUNBSCwrQkFBZSxRQUFmO0FBQ0FBLCtCQUFlLElBQWY7QUFDSDtBQUNELG1CQUFPQSxXQUFQO0FBQ0g7Ozs7OztrQkF0QmdCSixPIiwiZmlsZSI6IjUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDYXRhbG9nIHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAvL1xuICAgIH1cbiAgICBcbiAgICBzaG93Q2F0YWxvZ1Byb2R1Y3RzKHByb2R1Y3RzKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVRhYmxlT2ZJdGVtcygpOycpO1xuICAgICAgICBsZXQgcHJvZHVjdENlbGwgPVwiXCI7XG4gICAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgcHJvZHVjdHMgKHNob3VsZCBiZSAxMClcbiAgICAgICAgZm9yIChsZXQgaXRlbUNvdW50PTA7IGl0ZW1Db3VudDxwcm9kdWN0cy5sZW5ndGg7IGl0ZW1Db3VudCsrKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbiBmb3IgbG9vcCcpO1xuICAgICAgICAgICAgLy8gcHJvZHVjZSBhIFwidGFibGVcIiBvZiBpdGVtc1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRJdGVtID0gcHJvZHVjdHNbaXRlbUNvdW50XTtcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8ZGl2IGNsYXNzPVwicHJvZHVjdC13cmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6JytpdGVtQ291bnQqNTMwKydcIiA+JztcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8aW1nIHNyYz1cIicrY3VycmVudEl0ZW1bXCJpbWFnZVwiXSsnXCIgYWx0PVwiJytjdXJyZW50SXRlbVtcIm5hbWVcIl0rJ1wiIHRpdGxlPVwiJytjdXJyZW50SXRlbVtcIm5hbWVcIl0rJ1wiIGhlaWdodD1cIjI1MFwiIHdpZHRoPVwiMjUwXCI+JztcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8cD4nK2N1cnJlbnRJdGVtW1wibmFtZVwiXSsnPGJyPicrY3VycmVudEl0ZW1bXCJzYWxlUHJpY2VcIl0rJzwvcD4nO1xuICAgICAgICAgICAgcHJvZHVjdENlbGwgKz0gYDxidXR0b24gdHlwZT0nYnV0dG9uJyBpZD0ncXVpY2tWaWV3LWAgK2N1cnJlbnRJdGVtWydza3UnXSArIGAnIGRhdGEtc2t1PSdgICsgY3VycmVudEl0ZW1bJ3NrdSddICsgYCc+UXVpY2sgVmlldzwvYnV0dG9uPmA7XG4gICAgICAgICAgICBwcm9kdWN0Q2VsbCArPSBgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdgICtjdXJyZW50SXRlbVsnc2t1J10gKyBgJyBkYXRhLXNrdT0nYCArIGN1cnJlbnRJdGVtWydza3UnXSArIGAnPkFkZCBUbyBDYXJ0PC9idXR0b24+YDtcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8L2Rpdj4nO1xuICAgICAgICAgICAgcHJvZHVjdENlbGwgKz0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2R1Y3RDZWxsO1xuICAgIH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9DYXRhbG9nLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);