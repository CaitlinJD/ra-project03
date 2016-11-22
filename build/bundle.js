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
/******/ 	var hotCurrentHash = "0d9d1fd92c16e2d1c35b"; // eslint-disable-line no-unused-vars
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

	eval("'use strict';\n\nvar _App = __webpack_require__(1);\n\nvar _App2 = _interopRequireDefault(_App);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar app = new _App2.default();//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/OTU1MiJdLCJuYW1lcyI6WyJhcHAiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztBQUVJLElBQUlBLE1BQU0sbUJBQVYiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcHAgZnJvbSAnLi9BcHAnO1xuXG4gICAgbGV0IGFwcCA9IG5ldyBBcHAoKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _ShoppingCart = __webpack_require__(2);\n\nvar _ShoppingCart2 = _interopRequireDefault(_ShoppingCart);\n\nvar _BBProductAPIService = __webpack_require__(3);\n\nvar _BBProductAPIService2 = _interopRequireDefault(_BBProductAPIService);\n\nvar _BBProductData = __webpack_require__(4);\n\nvar _BBProductData2 = _interopRequireDefault(_BBProductData);\n\nvar _Catalog = __webpack_require__(5);\n\nvar _Catalog2 = _interopRequireDefault(_Catalog);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar App = function () {\n    function App() {\n        _classCallCheck(this, App);\n\n        console.log('creating app');\n        this.cartData = [];\n        this.getTheData();\n        this.catalog = new _Catalog2.default();\n        this.initModal();\n        this.shoppingCart = new _ShoppingCart2.default();\n        this.displayShoppingCart();\n    }\n\n    _createClass(App, [{\n        key: 'displayShoppingCart',\n        value: function displayShoppingCart() {\n            //console.log('you are in the app displayShoppingCart function');\n            var context = this;\n            $('#cart').on('click', null, { context: context }, function (evt) {\n                context.modal.style.display = \"block\";\n                context.shoppingCart.showCart(evt, context);\n            });\n        }\n    }, {\n        key: 'initModal',\n        value: function initModal() {\n            // Get the modal\n            this.modal = document.getElementById('myModal');\n\n            // Get the <span> element that closes the modal\n            this.closeSpan = document.getElementsByClassName(\"close\")[0];\n            // When the user clicks on <span> (x), close the modal\n            this.closeSpan.onclick = function () {\n                $(\"#myModal\").css('display', 'none');\n            };\n\n            // When the user clicks anywhere outside of the modal, close it\n            /* window.onclick = function(event) {\n                 if (event.target == this.modal) {\n                     this.modal.style.display = \"none\";\n                 }\n             }*/\n        }\n    }, {\n        key: 'getTheData',\n        value: function getTheData() {\n            // load the data\n            this.bbAPIService = new _BBProductAPIService2.default();\n            var context = this;\n            this.successCallback = function (response) {\n                context.data = JSON.parse(response);context.processResultsIntoUsableData(context.data);\n            };\n            this.failCallback = function (error) {\n                console.error('Failed! \\n', error);\n            };\n            this.bbAPIService.loadDataUsingJS().then(this.successCallback, this.failCallback);\n        }\n    }, {\n        key: 'processResultsIntoUsableData',\n        value: function processResultsIntoUsableData(result) {\n            // from here, extract only the product info\n            this.rawData = new _BBProductData2.default(result);\n            this.products = this.rawData.products;\n            this.createTableOfItems(this.products);\n        }\n    }, {\n        key: 'createTableOfItems',\n        value: function createTableOfItems(products) {\n            var _this = this;\n\n            // Adding html to flickity $('.productList').flickity\n\n            var productCells = this.catalog.showCatalogProducts(products);\n            document.getElementById('productList').innerHTML = productCells;\n\n            // ADDING EVENT LISTENERS TO THE BUTTONS\n\n            var _loop = function _loop(btnCount) {\n                var currentItem = products[btnCount];\n                //console.log('currentItem is ' + currentItem['sku']); \n                var context = _this;\n\n                // add to cart\n                $('#' + currentItem['sku']).on('click', null, { context: context }, function (event) {\n                    context.modal.style.display = \"block\";\n                    context.prepareItemToAddToCart(event, context);\n                });\n\n                // quick view\n                $('#quickView-' + currentItem['sku']).on('click', null, { context: context }, function (event) {\n                    context.modal.style.display = \"block\";\n                    context.showQuickView(event, context);\n                });\n            };\n\n            for (var btnCount = 0; btnCount < products.length; btnCount++) {\n                _loop(btnCount);\n            }\n        }\n    }, {\n        key: 'prepareItemToAddToCart',\n        value: function prepareItemToAddToCart(evt, context) {\n            if (evt == null || typeof evt === 'undefined') {\n                return;\n            }\n            var sku = $(evt.target).data('sku');\n            //console.log(sku);\n            var productAdded = this.getProductBySku(sku);\n            $('#shoppingCartContent').html(\"\"); // Clearing cart content here\n            $('#content').last().html('<img src=\"' + productAdded.thumbnailImage + '\" alt=\"' + productAdded.name + '\" title=\"' + productAdded.name + '\"><b>' + productAdded.name + '</b><br>has been added to the cart.<br>');\n            context.shoppingCart.addItemToCart(1, sku);\n        }\n    }, {\n        key: 'showQuickView',\n        value: function showQuickView(evt, context) {\n            if (evt == null || typeof evt === 'undefined') {\n                return;\n            }\n            var sku = $(evt.target).data('sku');\n            var productAdded = this.getProductBySku(sku);\n            $('#shoppingCartContent').html(\"\");\n            $('#content').last().html('<img src=\"' + productAdded.thumbnailImage + '\" alt=\"' + productAdded.name + '\" title=\"' + productAdded.name + '\"><b>' + productAdded.name + '</b><br><b>$' + productAdded.salePrice + '</b><p>' + productAdded.shortDescription + '<p><br>');\n        }\n    }, {\n        key: 'getProductBySku',\n        value: function getProductBySku() {\n            var sku = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n\n            if (sku == 0) {\n                return;\n            };\n            var criteriaFn = function criteriaFn(product) {\n                return product['sku'] == sku;\n            };\n            var result = this.products.filter(criteriaFn);\n            console.log(result);\n            return result[0];\n        }\n    }]);\n\n    return App;\n}();\n\nexports.default = App;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQXBwLmpzP2E2NzMiXSwibmFtZXMiOlsiQXBwIiwiY29uc29sZSIsImxvZyIsImNhcnREYXRhIiwiZ2V0VGhlRGF0YSIsImNhdGFsb2ciLCJpbml0TW9kYWwiLCJzaG9wcGluZ0NhcnQiLCJkaXNwbGF5U2hvcHBpbmdDYXJ0IiwiY29udGV4dCIsIiQiLCJvbiIsImV2dCIsIm1vZGFsIiwic3R5bGUiLCJkaXNwbGF5Iiwic2hvd0NhcnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY2xvc2VTcGFuIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsIm9uY2xpY2siLCJjc3MiLCJiYkFQSVNlcnZpY2UiLCJzdWNjZXNzQ2FsbGJhY2siLCJyZXNwb25zZSIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJwcm9jZXNzUmVzdWx0c0ludG9Vc2FibGVEYXRhIiwiZmFpbENhbGxiYWNrIiwiZXJyb3IiLCJsb2FkRGF0YVVzaW5nSlMiLCJ0aGVuIiwicmVzdWx0IiwicmF3RGF0YSIsInByb2R1Y3RzIiwiY3JlYXRlVGFibGVPZkl0ZW1zIiwicHJvZHVjdENlbGxzIiwic2hvd0NhdGFsb2dQcm9kdWN0cyIsImlubmVySFRNTCIsImJ0bkNvdW50IiwiY3VycmVudEl0ZW0iLCJldmVudCIsInByZXBhcmVJdGVtVG9BZGRUb0NhcnQiLCJzaG93UXVpY2tWaWV3IiwibGVuZ3RoIiwic2t1IiwidGFyZ2V0IiwicHJvZHVjdEFkZGVkIiwiZ2V0UHJvZHVjdEJ5U2t1IiwiaHRtbCIsImxhc3QiLCJ0aHVtYm5haWxJbWFnZSIsIm5hbWUiLCJhZGRJdGVtVG9DYXJ0Iiwic2FsZVByaWNlIiwic2hvcnREZXNjcmlwdGlvbiIsImNyaXRlcmlhRm4iLCJwcm9kdWN0IiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVxQkEsRztBQUNqQixtQkFBYztBQUFBOztBQUNWQyxnQkFB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dEIsSUFBZCxDQUFtQixLQUFuQixDQUFWO0FBQ0EsZ0JBQUl1QixlQUFlLEtBQUtDLGVBQUwsQ0FBcUJILEdBQXJCLENBQW5CO0FBQ0FyQyxjQUFFLHNCQUFGLEVBQTBCeUMsSUFBMUIsQ0FBK0IsRUFBL0I7QUFDQXpDLGNBQUUsVUFBRixFQUFjMEMsSUFBZCxHQUFxQkQsSUFBckIsQ0FBMEIsZUFBYUYsYUFBYUksY0FBMUIsR0FBeUMsU0FBekMsR0FBbURKLGFBQWFLLElBQWhFLEdBQXFFLFdBQXJFLEdBQWlGTCxhQUFhSyxJQUE5RixHQUFtRyxPQUFuRyxHQUE0R0wsYUFBYUssSUFBekgsR0FBK0gsY0FBL0gsR0FBOElMLGFBQWFPLFNBQTNKLEdBQXFLLFNBQXJLLEdBQStLUCxhQUFhUSxnQkFBNUwsR0FBNk0sU0FBdk87QUFDSDs7OzBDQUVxQjtBQUFBLGdCQUFOVixHQUFNLHVFQUFGLENBQUU7O0FBQ2xCLGdCQUFJQSxPQUFLLENBQVQsRUFBVztBQUFFO0FBQVM7QUFDdEIsZ0JBQUlXLGFBQWEsU0FBYkEsVUFBYSxDQUFTQyxPQUFULEVBQWlCO0FBQzlCLHVCQUFPQSxRQUFRLEtBQVIsS0FBa0JaLEdBQXpCO0FBQ0gsYUFGRDtBQUdBLGdCQUFJYixTQUFTLEtBQUtFLFFBQUwsQ0FBY3dCLE1BQWQsQ0FBcUJGLFVBQXJCLENBQWI7QUFDQXpELG9CQUFRQyxHQUFSLENBQVlnQyxNQUFaO0FBQ0EsbUJBQU9BLE9BQU8sQ0FBUCxDQUFQO0FBQ0g7Ozs7OztrQkFuSGdCbEMsRyIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNob3BwaW5nQ2FydCBmcm9tICcuL1Nob3BwaW5nQ2FydCc7XG5pbXBvcnQgQkJQcm9kdWN0QVBJU2VydmljZSBmcm9tICcuL0JCUHJvZHVjdEFQSVNlcnZpY2UnO1xuaW1wb3J0IEJCUHJvZHVjdERhdGEgZnJvbSAnLi9tb2RlbC9CQlByb2R1Y3REYXRhJztcbmltcG9ydCBDYXRhbG9nIGZyb20gJy4vQ2F0YWxvZyc7IFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgYXBwJyk7XG4gICAgICAgIHRoaXMuY2FydERhdGEgPSBbXTtcbiAgICAgICAgdGhpcy5nZXRUaGVEYXRhKCk7XG4gICAgICAgIHRoaXMuY2F0YWxvZyA9IG5ldyBDYXRhbG9nKCk7XG4gICAgICAgIHRoaXMuaW5pdE1vZGFsKCk7XG4gICAgICAgIHRoaXMuc2hvcHBpbmdDYXJ0ID0gbmV3IFNob3BwaW5nQ2FydCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlTaG9wcGluZ0NhcnQoKTtcbiAgICB9XG4gICAgXG4gICAgZGlzcGxheVNob3BwaW5nQ2FydCgpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCd5b3UgYXJlIGluIHRoZSBhcHAgZGlzcGxheVNob3BwaW5nQ2FydCBmdW5jdGlvbicpO1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICQoJyNjYXJ0Jykub24oJ2NsaWNrJyxudWxsLHtjb250ZXh0OmNvbnRleHR9LGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICBjb250ZXh0Lm1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICBjb250ZXh0LnNob3BwaW5nQ2FydC5zaG93Q2FydChldnQsIGNvbnRleHQpO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBcbiAgICBpbml0TW9kYWwoKXtcbiAgICAgICAgLy8gR2V0IHRoZSBtb2RhbFxuICAgICAgICB0aGlzLm1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215TW9kYWwnKTtcblxuICAgICAgICAvLyBHZXQgdGhlIDxzcGFuPiBlbGVtZW50IHRoYXQgY2xvc2VzIHRoZSBtb2RhbFxuICAgICAgICB0aGlzLmNsb3NlU3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjbG9zZVwiKVswXTtcbiAgICAgICAgLy8gV2hlbiB0aGUgdXNlciBjbGlja3Mgb24gPHNwYW4+ICh4KSwgY2xvc2UgdGhlIG1vZGFsXG4gICAgICAgIHRoaXMuY2xvc2VTcGFuLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoXCIjbXlNb2RhbFwiKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2hlbiB0aGUgdXNlciBjbGlja3MgYW55d2hlcmUgb3V0c2lkZSBvZiB0aGUgbW9kYWwsIGNsb3NlIGl0XG4gICAgICAgLyogd2luZG93Lm9uY2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PSB0aGlzLm1vZGFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0qL1xuICAgIH0gXG4gICAgXG4gICAgZ2V0VGhlRGF0YSgpe1xuICAgICAgICAvLyBsb2FkIHRoZSBkYXRhXG4gICAgICAgIHRoaXMuYmJBUElTZXJ2aWNlID0gbmV3IEJCUHJvZHVjdEFQSVNlcnZpY2U7IFxuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIHRoaXMuc3VjY2Vzc0NhbGxiYWNrID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpOyBjb250ZXh0LnByb2Nlc3NSZXN1bHRzSW50b1VzYWJsZURhdGEoY29udGV4dC5kYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICB0aGlzLmZhaWxDYWxsYmFjayA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCEgXFxuJywgZXJyb3IpO1xuICAgICAgIH07XG4gICAgICAgdGhpcy5iYkFQSVNlcnZpY2UubG9hZERhdGFVc2luZ0pTKCkudGhlbih0aGlzLnN1Y2Nlc3NDYWxsYmFjaywgdGhpcy5mYWlsQ2FsbGJhY2spO1xuICAgIH1cbiAgICBcbiAgICBwcm9jZXNzUmVzdWx0c0ludG9Vc2FibGVEYXRhKHJlc3VsdCl7XG4gICAgICAgIC8vIGZyb20gaGVyZSwgZXh0cmFjdCBvbmx5IHRoZSBwcm9kdWN0IGluZm9cbiAgICAgICAgdGhpcy5yYXdEYXRhID0gbmV3IEJCUHJvZHVjdERhdGEgKHJlc3VsdCk7XG4gICAgICAgIHRoaXMucHJvZHVjdHMgPSB0aGlzLnJhd0RhdGEucHJvZHVjdHM7XG4gICAgICAgIHRoaXMuY3JlYXRlVGFibGVPZkl0ZW1zKHRoaXMucHJvZHVjdHMpO1xuICAgIH1cbiAgICBcbiAgICBjcmVhdGVUYWJsZU9mSXRlbXMocHJvZHVjdHMpe1xuICAgICAgICAvLyBBZGRpbmcgaHRtbCB0byBmbGlja2l0eSAkKCcucHJvZHVjdExpc3QnKS5mbGlja2l0eVxuICAgICAgICBcbiAgICAgICAgbGV0IHByb2R1Y3RDZWxscyA9IHRoaXMuY2F0YWxvZy5zaG93Q2F0YWxvZ1Byb2R1Y3RzKHByb2R1Y3RzKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2R1Y3RMaXN0JykuaW5uZXJIVE1MID0gcHJvZHVjdENlbGxzOyBcblxuICAgICAgICAvLyBBRERJTkcgRVZFTlQgTElTVEVORVJTIFRPIFRIRSBCVVRUT05TXG4gICAgICAgIGZvciAobGV0IGJ0bkNvdW50PTA7IGJ0bkNvdW50PHByb2R1Y3RzLmxlbmd0aDsgYnRuQ291bnQrKyl7XG4gICAgICAgICAgICBsZXQgY3VycmVudEl0ZW0gPSBwcm9kdWN0c1tidG5Db3VudF07XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjdXJyZW50SXRlbSBpcyAnICsgY3VycmVudEl0ZW1bJ3NrdSddKTsgXG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGFkZCB0byBjYXJ0XG4gICAgICAgICAgICAkKCcjJytjdXJyZW50SXRlbVsnc2t1J10pLm9uKCdjbGljaycsIG51bGwsIHtjb250ZXh0OmNvbnRleHR9LCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIGNvbnRleHQucHJlcGFyZUl0ZW1Ub0FkZFRvQ2FydChldmVudCwgY29udGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gcXVpY2sgdmlld1xuICAgICAgICAgICAgJCgnI3F1aWNrVmlldy0nK2N1cnJlbnRJdGVtWydza3UnXSkub24oJ2NsaWNrJywgbnVsbCwge2NvbnRleHQ6Y29udGV4dH0sIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgY29udGV4dC5zaG93UXVpY2tWaWV3KGV2ZW50LCBjb250ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByZXBhcmVJdGVtVG9BZGRUb0NhcnQoZXZ0LCBjb250ZXh0KXtcbiAgICAgICAgaWYoZXZ0PT1udWxsIHx8IHR5cGVvZiAoZXZ0KSA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBza3UgPSAkKGV2dC50YXJnZXQpLmRhdGEoJ3NrdScpOyAgICAgIFxuICAgICAgICAvL2NvbnNvbGUubG9nKHNrdSk7XG4gICAgICAgIGxldCBwcm9kdWN0QWRkZWQgPSB0aGlzLmdldFByb2R1Y3RCeVNrdShza3UpO1xuICAgICAgICAkKCcjc2hvcHBpbmdDYXJ0Q29udGVudCcpLmh0bWwoXCJcIik7IC8vIENsZWFyaW5nIGNhcnQgY29udGVudCBoZXJlXG4gICAgICAgICQoJyNjb250ZW50JykubGFzdCgpLmh0bWwoJzxpbWcgc3JjPVwiJytwcm9kdWN0QWRkZWQudGh1bWJuYWlsSW1hZ2UrJ1wiIGFsdD1cIicrcHJvZHVjdEFkZGVkLm5hbWUrJ1wiIHRpdGxlPVwiJytwcm9kdWN0QWRkZWQubmFtZSsnXCI+PGI+JysgcHJvZHVjdEFkZGVkLm5hbWUgKyc8L2I+PGJyPmhhcyBiZWVuIGFkZGVkIHRvIHRoZSBjYXJ0Ljxicj4nKTtcbiAgICAgICAgY29udGV4dC5zaG9wcGluZ0NhcnQuYWRkSXRlbVRvQ2FydCgxLCBza3UpO1xuICAgIH1cbiAgICBcbiAgICBzaG93UXVpY2tWaWV3KGV2dCwgY29udGV4dCl7XG4gICAgICAgIGlmKGV2dD09bnVsbCB8fCB0eXBlb2YgKGV2dCkgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2t1ID0gJChldnQudGFyZ2V0KS5kYXRhKCdza3UnKTtcbiAgICAgICAgbGV0IHByb2R1Y3RBZGRlZCA9IHRoaXMuZ2V0UHJvZHVjdEJ5U2t1KHNrdSk7XG4gICAgICAgICQoJyNzaG9wcGluZ0NhcnRDb250ZW50JykuaHRtbChcIlwiKTtcbiAgICAgICAgJCgnI2NvbnRlbnQnKS5sYXN0KCkuaHRtbCgnPGltZyBzcmM9XCInK3Byb2R1Y3RBZGRlZC50aHVtYm5haWxJbWFnZSsnXCIgYWx0PVwiJytwcm9kdWN0QWRkZWQubmFtZSsnXCIgdGl0bGU9XCInK3Byb2R1Y3RBZGRlZC5uYW1lKydcIj48Yj4nKyBwcm9kdWN0QWRkZWQubmFtZSArJzwvYj48YnI+PGI+JCcrcHJvZHVjdEFkZGVkLnNhbGVQcmljZSsnPC9iPjxwPicrcHJvZHVjdEFkZGVkLnNob3J0RGVzY3JpcHRpb24rJzxwPjxicj4nKTtcbiAgICB9XG4gICAgXG4gICAgZ2V0UHJvZHVjdEJ5U2t1KHNrdT0wKXtcbiAgICAgICAgaWYgKHNrdT09MCl7IHJldHVybjsgfTtcbiAgICAgICAgbGV0IGNyaXRlcmlhRm4gPSBmdW5jdGlvbihwcm9kdWN0KXtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0Wydza3UnXSA9PSBza3U7XG4gICAgICAgIH07XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLnByb2R1Y3RzLmZpbHRlcihjcml0ZXJpYUZuKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFswXTtcbiAgICB9ICAgXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvQXBwLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar ShoppingCart = function () {\n    function ShoppingCart() {\n        _classCallCheck(this, ShoppingCart);\n\n        // initialize the shopping cart\n        this.ss = null;\n        this.initializeCart();\n    }\n\n    _createClass(ShoppingCart, [{\n        key: 'initializeCart',\n        value: function initializeCart() {\n            if ((typeof Storage === 'undefined' ? 'undefined' : _typeof(Storage)) != undefined) {\n                this.ss = sessionStorage;\n            } else {\n                console.log('Cody says you need a new browser! boo');\n                return;\n            }\n        }\n    }, {\n        key: 'addItemToCart',\n        value: function addItemToCart() {\n            var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n            var item = arguments[1];\n\n            if (this.ss == null) {\n                return;\n            };\n            if (qty <= 0) {\n                return;\n            }\n            if (item == null || typeof item == 'undefined') {\n                return;\n            }\n\n            //console.log('the # of items in storage session is ' + this.ss.length);\n            var numberOfItemsInCart = this.ss.length;\n\n            // case: we're the 1st product\n            if (numberOfItemsInCart == 0) {\n                this.ss.setItem(item.toString(), qty.toString());\n                this.totalCartItems();\n                return;\n            } else {\n                var numMatches = 0;\n                //check to see if the item is already in ss\n                for (var theKey in this.ss) {\n                    console.log('the Key =' + theKey);\n                    if (theKey == item.toString()) {\n                        // update quantity value;\n                        var newValue = (parseInt(this.ss.getItem(theKey)) + parseInt(qty)).toString();\n                        this.ss.setItem(theKey, newValue);\n                        numMatches = 1;\n                        this.totalCartItems();\n                    } else {\n                        console.log('no match');\n                    }\n                }\n                // add the item if not already in ss\n                if (numMatches == 0) {\n                    this.ss.setItem(item.toString(), qty.toString());\n                    this.totalCartItems();\n                }\n            }\n        }\n    }, {\n        key: 'deleteItemFromCart',\n        value: function deleteItemFromCart() {\n            var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n            var item = arguments[1];\n\n            if (this.ss == null) {\n                return;\n            };\n            if (qty <= 0) {\n                return;\n            }\n            if (item == null || typeof item == 'undefined') {\n                return;\n            }\n            // check for ss\n\n            var numberOfItemsInCart = this.ss.length;\n            if (numberOfItemsInCart == 0) {\n                return;\n            }\n            // check that there are items\n            var numMatches = 0;\n            for (var theKey in this.ss) {\n                if (theKey == item.toString()) {\n                    // update quantity value;\n                    var newValue = (parseInt(this.ss.getItem(theKey)) - parseInt(qty)).toString();\n                    this.ss.setItem(theKey, newValue.toString());\n                    numMatches = 1;\n                    // update the input value\n                    var currentInputValue = $('#input-' + theKey).attr('value');\n                    currentInputValue = currentInputValue - 1;\n                    $('#input-' + theKey).attr('value', currentInputValue);\n                    $('#input-' + theKey).val(currentInputValue);\n                    if (newValue == 0) {\n                        this.ss.removeItem(theKey);\n                        $('#input-' + theKey).parent().remove();\n                        break;\n                        //return;\n                    }\n                } else {\n                    console.log('no match');\n                }\n            }\n            if (numMatches == 0) {\n                return;\n            }\n            this.totalCartItems();\n        }\n    }, {\n        key: 'updateCart',\n        value: function updateCart() {\n            console.log('you are in the update cart button function');\n            var currentItems = $('#shoppingCartContent').children('li');\n            console.log(currentItems);\n\n            for (var i = 0; i < currentItems.length; i++) {\n                var itemSku = $(currentItems[i]).children('input').data('sku');\n                var itemQty = $(currentItems[i]).children('input').val();\n                console.log(itemSku);\n                console.log(itemQty);\n                // check item sku to make sure it's not undefined\n                if (itemSku == undefined) {\n                    console.log('no match');\n                } else {\n                    // loop through session storage\n                    for (var theKey in this.ss) {\n                        //look for a match in sku\n                        if (theKey == itemSku) {\n                            this.ss.setItem(theKey, itemQty);\n                            // remove item from cart if qty is 0\n                            if (itemQty == 0) {\n                                this.ss.removeItem(theKey);\n                                $('#input-' + theKey).parent().remove();\n                                break;\n                            }\n                        }\n                    }\n                }\n            }\n            this.totalCartItems();\n        }\n\n        //update the total number of items in cart shown in header\n\n    }, {\n        key: 'totalCartItems',\n        value: function totalCartItems() {\n            //loop through ss and add all the qty's\n            var total = 0;\n            for (var theKey in this.ss) {\n                var qty = parseInt(this.ss.getItem(theKey));\n                total += qty;\n                console.log(\"The total number of items is: \" + total);\n            }\n            $('.total-items').html(total);\n        }\n    }, {\n        key: 'showCart',\n        value: function showCart(evt, context) {\n            var _this = this;\n\n            //console.log('you made it to the shopping cart!');\n            $('#content').html(\"\");\n            $('#content').html(\"<h1>Shopping Cart</h1>\");\n            $('#shoppingCartContent').html(\"\");\n            var cartContent = \"\";\n            var cartQty = this.ss.length;\n            //console.log('cart-Qty: '+cartQty);\n            if (this.ss == null || cartQty <= 0) {\n                cartContent = \"<li><b>You have no items in the shopping cart.</b></li>\";\n            } else {\n                var _loop = function _loop(theKey) {\n                    var criteriaFn = function criteriaFn(product) {\n                        return product['sku'] == theKey;\n                    };\n                    var result = context.products.filter(criteriaFn);\n                    console.log(result);\n                    var qty = parseInt(_this.ss.getItem(theKey));\n                    console.log(qty);\n                    cartContent += \"<li><img src='\" + result[0].thumbnailImage + \"' alt='\" + result[0].name + \"' title='\" + result[0].name + \"'><h2 class='prodName'>\" + result[0].name + \"</h2><p>$\" + result[0].salePrice + \"</p><input id='input-\" + result[0].sku + \"' data-sku='\" + result[0].sku + \"'type='number' value='\" + qty + \"'><button id='delete-\" + result[0].sku + \"' data-sku='\" + result[0].sku + \"'>Remove Item</button></li>\";\n                };\n\n                for (var theKey in this.ss) {\n                    _loop(theKey);\n                }\n                $('#shoppingCartContent').append(cartContent);\n\n                // ADDING EVENT HANDLERS\n\n                var _loop2 = function _loop2(btnCount) {\n                    var currentItem = context.products[btnCount];\n                    // DELETE BUTTONS\n                    $(\"#delete-\" + currentItem['sku']).on('click', null, {}, function (event) {\n                        var item = $(\"#delete-\" + currentItem['sku']).data('sku');\n                        context.shoppingCart.deleteItemFromCart(1, item);\n                    });\n                };\n\n                for (var btnCount = 0; btnCount < context.products.length; btnCount++) {\n                    _loop2(btnCount);\n                }\n\n                var updateBtn = \"<button id='updateBtn'>Update Cart</button><button>Checkout</button>\";\n                $('#shoppingCartContent').append(updateBtn);\n                $('#updateBtn').on('click', null, {}, function (event) {\n                    context.shoppingCart.updateCart();\n                });\n            }\n        }\n    }]);\n\n    return ShoppingCart;\n}();\n\nexports.default = ShoppingCart;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU2hvcHBpbmdDYXJ0LmpzPzc5MWEiXSwibmFtZXMiOlsiU2hvcHBpbmdDYXJ0Iiwic3MiLCJpbml0aWFsaXplQ2FydCIsIlN0b3JhZ2UiLCJ1bmRlZmluZWQiLCJzZXNzaW9uU3RvcmFnZSIsImNvbnNvbGUiLCJsb2ciLCJxdHkiLCJpdGVtIiwibnVtYmVyT2ZJdGVtc0luQ2FydCIsImxlbmd0aCIsInNldEl0ZW0iLCJ0b1N0cmluZyIsInRvdGFsQ2FydEl0ZW1zIiwibnVtTWF0Y2hlcyIsInRoZUtleSIsIm5ld1ZhbHVlIiwicGFyc2VJbnQiLCJnZXRJdGVtIiwiY3VycmVudElucHV0VmFsdWUiLCIkIiwiYXR0ciIsInZhbCIsInJlbW92ZUl0ZW0iLCJwYXJlbnQiLCJyZW1vdmUiLCJjdXJyZW50SXRlbXMiLCJjaGlsZHJlbiIsImkiLCJpdGVtU2t1IiwiZGF0YSIsIml0ZW1RdHkiLCJ0b3RhbCIsImh0bWwiLCJldnQiLCJjb250ZXh0IiwiY2FydENvbnRlbnQiLCJjYXJ0UXR5IiwiY3JpdGVyaWFGbiIsInByb2R1Y3QiLCJyZXN1bHQiLCJwcm9kdWN0cyIsImZpbHRlciIsInRodW1ibmFpbEltYWdlIiwibmFtZSIsInNhbGVQcmljZSIsInNrdSIsImFwcGVuZCIsImJ0bkNvdW50IiwiY3VycmVudEl0ZW0iLCJvbiIsImV2ZW50Iiwic2hvcHBpbmdDYXJ0IiwiZGVsZXRlSXRlbUZyb21DYXJ0IiwidXBkYXRlQnRuIiwidXBkYXRlQ2FydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQXFCQSxZO0FBQ2pCLDRCQUFhO0FBQUE7O0FBQ1Q7QUFDQSxhQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBLGFBQUtDLGNBQUw7QUFDSDs7Ozt5Q0FFaUI7QUFDZCxnQkFBSSxRQUFRQyxPQUFSLHlDQUFRQSxPQUFSLE1BQW9CQyxTQUF4QixFQUFrQztBQUM5QixxQkFBS0gsRUFBTCxHQUFTSSxjQUFUO0FBQ0gsYUFGRCxNQUVRO0FBQ0pD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LElBQTVDLEVBQWlELEVBQWpELEVBQW9ELFVBQVNDLEtBQVQsRUFBZTtBQUMvRCw0QkFBSTNDLE9BQU9ZLEVBQUUsYUFBVzZCLFlBQVksS0FBWixDQUFiLEVBQWlDbkIsSUFBakMsQ0FBc0MsS0FBdEMsQ0FBWDtBQUNBSyxnQ0FBUWlCLFlBQVIsQ0FBcUJDLGtCQUFyQixDQUF3QyxDQUF4QyxFQUEyQzdDLElBQTNDO0FBQ0gscUJBSEQ7QUFsQkY7O0FBZUYscUJBQUksSUFBSXdDLFdBQVMsQ0FBakIsRUFBb0JBLFdBQVNiLFFBQVFNLFFBQVIsQ0FBaUIvQixNQUE5QyxFQUFzRHNDLFVBQXRELEVBQWlFO0FBQUEsMkJBQXpEQSxRQUF5RDtBQU9oRTs7QUFFRCxvQkFBSU0sWUFBWSxzRUFBaEI7QUFDQWxDLGtCQUFFLHNCQUFGLEVBQTBCMkIsTUFBMUIsQ0FBaUNPLFNBQWpDO0FBQ0FsQyxrQkFBRSxZQUFGLEVBQWdCOEIsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBMkIsSUFBM0IsRUFBZ0MsRUFBaEMsRUFBb0MsVUFBU0MsS0FBVCxFQUFlO0FBQy9DaEIsNEJBQVFpQixZQUFSLENBQXFCRyxVQUFyQjtBQUNILGlCQUZEO0FBR0g7QUFDSjs7Ozs7O2tCQTNLZ0J4RCxZIiwiZmlsZSI6IjIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaG9wcGluZ0NhcnQge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNob3BwaW5nIGNhcnRcbiAgICAgICAgdGhpcy5zcyA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNhcnQoKVxuICAgIH1cbiAgICBcbiAgICBpbml0aWFsaXplQ2FydCAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKFN0b3JhZ2UpICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0aGlzLnNzPSBzZXNzaW9uU3RvcmFnZTtcbiAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29keSBzYXlzIHlvdSBuZWVkIGEgbmV3IGJyb3dzZXIhIGJvbycpO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgYWRkSXRlbVRvQ2FydChxdHk9MCwgaXRlbSl7XG4gICAgICAgIGlmICh0aGlzLnNzID09IG51bGwgKSB7cmV0dXJufTtcbiAgICAgICAgaWYgKHF0eTw9MCkge3JldHVybjt9XG4gICAgICAgIGlmIChpdGVtID09IG51bGwgfHwgdHlwZW9mIChpdGVtKT09J3VuZGVmaW5lZCcpIHtyZXR1cm47fVxuICAgICAgICBcbiAgICAgICAgLy9jb25zb2xlLmxvZygndGhlICMgb2YgaXRlbXMgaW4gc3RvcmFnZSBzZXNzaW9uIGlzICcgKyB0aGlzLnNzLmxlbmd0aCk7XG4gICAgICAgIGxldCBudW1iZXJPZkl0ZW1zSW5DYXJ0ID0gdGhpcy5zcy5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICAvLyBjYXNlOiB3ZSdyZSB0aGUgMXN0IHByb2R1Y3RcbiAgICAgICAgaWYgKG51bWJlck9mSXRlbXNJbkNhcnQgPT0gMCl7XG4gICAgICAgICAgICB0aGlzLnNzLnNldEl0ZW0oaXRlbS50b1N0cmluZygpLCBxdHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB0aGlzLnRvdGFsQ2FydEl0ZW1zKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbnVtTWF0Y2hlcyA9IDA7XG4gICAgICAgICAgICAvL2NoZWNrIHRvIHNlZSBpZiB0aGUgaXRlbSBpcyBhbHJlYWR5IGluIHNzXG4gICAgICAgICAgICBmb3IgKGxldCB0aGVLZXkgaW4gdGhpcy5zcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGUgS2V5ID0nICsgdGhlS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAodGhlS2V5ID09IGl0ZW0udG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgcXVhbnRpdHkgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IChwYXJzZUludCh0aGlzLnNzLmdldEl0ZW0odGhlS2V5KSkgKyBwYXJzZUludChxdHkpKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNzLnNldEl0ZW0odGhlS2V5LCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG51bU1hdGNoZXMgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsQ2FydEl0ZW1zKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG1hdGNoJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYWRkIHRoZSBpdGVtIGlmIG5vdCBhbHJlYWR5IGluIHNzXG4gICAgICAgICAgICBpZiAobnVtTWF0Y2hlcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcy5zZXRJdGVtKGl0ZW0udG9TdHJpbmcoKSwgcXR5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxDYXJ0SXRlbXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBkZWxldGVJdGVtRnJvbUNhcnQocXR5PTAsIGl0ZW0peyAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnNzID09IG51bGwgKSB7cmV0dXJufTtcbiAgICAgICAgaWYgKHF0eTw9MCkge3JldHVybjt9XG4gICAgICAgIGlmIChpdGVtID09IG51bGwgfHwgdHlwZW9mIChpdGVtKT09J3VuZGVmaW5lZCcpIHtyZXR1cm47fVxuICAgICAgICAvLyBjaGVjayBmb3Igc3NcbiAgICAgICAgXG4gICAgICAgIGxldCBudW1iZXJPZkl0ZW1zSW5DYXJ0ID0gdGhpcy5zcy5sZW5ndGg7XG4gICAgICAgIGlmIChudW1iZXJPZkl0ZW1zSW5DYXJ0ID09IDApIHtyZXR1cm47fVxuICAgICAgICAvLyBjaGVjayB0aGF0IHRoZXJlIGFyZSBpdGVtc1xuICAgICAgICBsZXQgbnVtTWF0Y2hlcyA9IDA7XG4gICAgICAgIGZvciAobGV0IHRoZUtleSBpbiB0aGlzLnNzKXtcbiAgICAgICAgICAgIGlmICh0aGVLZXkgPT0gaXRlbS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHF1YW50aXR5IHZhbHVlO1xuICAgICAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IChwYXJzZUludCh0aGlzLnNzLmdldEl0ZW0odGhlS2V5KSkgLSBwYXJzZUludChxdHkpKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3Muc2V0SXRlbSh0aGVLZXksIG5ld1ZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIG51bU1hdGNoZXMgPSAxOyBcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGlucHV0IHZhbHVlXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJbnB1dFZhbHVlID0gJCgnI2lucHV0LScrdGhlS2V5KS5hdHRyKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRJbnB1dFZhbHVlID0gY3VycmVudElucHV0VmFsdWUgLSAxO1xuICAgICAgICAgICAgICAgICQoJyNpbnB1dC0nK3RoZUtleSkuYXR0cigndmFsdWUnLGN1cnJlbnRJbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICAkKCcjaW5wdXQtJyt0aGVLZXkpLnZhbChjdXJyZW50SW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IDApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNzLnJlbW92ZUl0ZW0odGhlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lucHV0LScrdGhlS2V5KS5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIG1hdGNoJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bU1hdGNoZXMgPT0gMCkge3JldHVybjt9XG4gICAgICAgIHRoaXMudG90YWxDYXJ0SXRlbXMoKTtcbiAgICB9XG4gICAgXG4gICAgdXBkYXRlQ2FydCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3lvdSBhcmUgaW4gdGhlIHVwZGF0ZSBjYXJ0IGJ1dHRvbiBmdW5jdGlvbicpO1xuICAgICAgICBsZXQgY3VycmVudEl0ZW1zID0gJCgnI3Nob3BwaW5nQ2FydENvbnRlbnQnKS5jaGlsZHJlbignbGknKTtcbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudEl0ZW1zKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGl0ZW1Ta3UgPSAkKGN1cnJlbnRJdGVtc1tpXSkuY2hpbGRyZW4oJ2lucHV0JykuZGF0YSgnc2t1Jyk7XG4gICAgICAgICAgICBsZXQgaXRlbVF0eSA9ICQoY3VycmVudEl0ZW1zW2ldKS5jaGlsZHJlbignaW5wdXQnKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW1Ta3UpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbVF0eSk7XG4gICAgICAgICAgICAvLyBjaGVjayBpdGVtIHNrdSB0byBtYWtlIHN1cmUgaXQncyBub3QgdW5kZWZpbmVkXG4gICAgICAgICAgICBpZiAoaXRlbVNrdSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbWF0Y2gnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHNlc3Npb24gc3RvcmFnZVxuICAgICAgICAgICAgICAgIGZvciAobGV0IHRoZUtleSBpbiB0aGlzLnNzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vbG9vayBmb3IgYSBtYXRjaCBpbiBza3VcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUtleSA9PSBpdGVtU2t1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNzLnNldEl0ZW0odGhlS2V5LCBpdGVtUXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdGVtIGZyb20gY2FydCBpZiBxdHkgaXMgMFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1RdHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3MucmVtb3ZlSXRlbSh0aGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpbnB1dC0nICsgdGhlS2V5KS5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvdGFsQ2FydEl0ZW1zKCk7XG4gICAgfVxuXG4gICAgLy91cGRhdGUgdGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcyBpbiBjYXJ0IHNob3duIGluIGhlYWRlclxuICAgIHRvdGFsQ2FydEl0ZW1zKCkge1xuICAgICAgICAvL2xvb3AgdGhyb3VnaCBzcyBhbmQgYWRkIGFsbCB0aGUgcXR5J3NcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgZm9yIChsZXQgdGhlS2V5IGluIHRoaXMuc3MpIHtcbiAgICAgICAgICAgIGxldCBxdHkgPSAocGFyc2VJbnQodGhpcy5zcy5nZXRJdGVtKHRoZUtleSkpKTtcbiAgICAgICAgICAgIHRvdGFsICs9IHF0eTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcyBpczogXCIgKyB0b3RhbCk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnLnRvdGFsLWl0ZW1zJykuaHRtbCh0b3RhbCk7XG4gICAgfVxuXG4gICAgc2hvd0NhcnQoZXZ0LCBjb250ZXh0KXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygneW91IG1hZGUgaXQgdG8gdGhlIHNob3BwaW5nIGNhcnQhJyk7XG4gICAgICAgICQoJyNjb250ZW50JykuaHRtbChcIlwiKTtcbiAgICAgICAgJCgnI2NvbnRlbnQnKS5odG1sKFwiPGgxPlNob3BwaW5nIENhcnQ8L2gxPlwiKTtcbiAgICAgICAgJCgnI3Nob3BwaW5nQ2FydENvbnRlbnQnKS5odG1sKFwiXCIpO1xuICAgICAgICBsZXQgY2FydENvbnRlbnQgPSBcIlwiO1xuICAgICAgICBsZXQgY2FydFF0eSA9IHRoaXMuc3MubGVuZ3RoO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjYXJ0LVF0eTogJytjYXJ0UXR5KTtcbiAgICAgICAgaWYgKHRoaXMuc3MgPT0gbnVsbCB8fCBjYXJ0UXR5PD0wKSB7XG4gICAgICAgICAgICBjYXJ0Q29udGVudCA9IFwiPGxpPjxiPllvdSBoYXZlIG5vIGl0ZW1zIGluIHRoZSBzaG9wcGluZyBjYXJ0LjwvYj48L2xpPlwiO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBmb3IobGV0IHRoZUtleSBpbiB0aGlzLnNzKXtcbiAgICAgICAgICAgICAgICBsZXQgY3JpdGVyaWFGbiA9IGZ1bmN0aW9uKHByb2R1Y3Qpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdFsnc2t1J10gPT0gdGhlS2V5O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGNvbnRleHQucHJvZHVjdHMuZmlsdGVyKGNyaXRlcmlhRm4pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgbGV0IHF0eSA9IHBhcnNlSW50KHRoaXMuc3MuZ2V0SXRlbSh0aGVLZXkpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhxdHkpO1xuICAgICAgICAgICAgICAgIGNhcnRDb250ZW50ICs9IFwiPGxpPjxpbWcgc3JjPSdcIityZXN1bHRbMF0udGh1bWJuYWlsSW1hZ2UrXCInIGFsdD0nXCIrcmVzdWx0WzBdLm5hbWUrXCInIHRpdGxlPSdcIityZXN1bHRbMF0ubmFtZStcIic+PGgyIGNsYXNzPSdwcm9kTmFtZSc+XCIrcmVzdWx0WzBdLm5hbWUrXCI8L2gyPjxwPiRcIityZXN1bHRbMF0uc2FsZVByaWNlK1wiPC9wPjxpbnB1dCBpZD0naW5wdXQtXCIrcmVzdWx0WzBdLnNrdStcIicgZGF0YS1za3U9J1wiK3Jlc3VsdFswXS5za3UrXCIndHlwZT0nbnVtYmVyJyB2YWx1ZT0nXCIrcXR5K1wiJz48YnV0dG9uIGlkPSdkZWxldGUtXCIrcmVzdWx0WzBdLnNrdStcIicgZGF0YS1za3U9J1wiK3Jlc3VsdFswXS5za3UrXCInPlJlbW92ZSBJdGVtPC9idXR0b24+PC9saT5cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnI3Nob3BwaW5nQ2FydENvbnRlbnQnKS5hcHBlbmQoY2FydENvbnRlbnQpO1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vIEFERElORyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAgICAgZm9yKGxldCBidG5Db3VudD0wOyBidG5Db3VudDxjb250ZXh0LnByb2R1Y3RzLmxlbmd0aDsgYnRuQ291bnQrKyl7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJdGVtID0gY29udGV4dC5wcm9kdWN0c1tidG5Db3VudF07XG4gICAgICAgICAgICAgICAgLy8gREVMRVRFIEJVVFRPTlNcbiAgICAgICAgICAgICAgICAkKFwiI2RlbGV0ZS1cIitjdXJyZW50SXRlbVsnc2t1J10pLm9uKCdjbGljaycsbnVsbCx7fSxmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gJChcIiNkZWxldGUtXCIrY3VycmVudEl0ZW1bJ3NrdSddKS5kYXRhKCdza3UnKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zaG9wcGluZ0NhcnQuZGVsZXRlSXRlbUZyb21DYXJ0KDEsIGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB1cGRhdGVCdG4gPSBcIjxidXR0b24gaWQ9J3VwZGF0ZUJ0bic+VXBkYXRlIENhcnQ8L2J1dHRvbj48YnV0dG9uPkNoZWNrb3V0PC9idXR0b24+XCI7XG4gICAgICAgICAgICAkKCcjc2hvcHBpbmdDYXJ0Q29udGVudCcpLmFwcGVuZCh1cGRhdGVCdG4pO1xuICAgICAgICAgICAgJCgnI3VwZGF0ZUJ0bicpLm9uKCdjbGljaycsbnVsbCx7fSAsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc2hvcHBpbmdDYXJ0LnVwZGF0ZUNhcnQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvU2hvcHBpbmdDYXJ0LmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar BBProductAPIService = function () {\n    function BBProductAPIService() {\n        _classCallCheck(this, BBProductAPIService);\n\n        this.bbURL = \"https://api.remix.bestbuy.com/v1/products((categoryPath.id=abcat0501000))?apiKey=8ccddf4rtjz5k5btqam84qak&format=json&show=image,thumbnailImage,shortDescription,name,regularPrice,salePrice,sku\";\n    }\n\n    _createClass(BBProductAPIService, [{\n        key: 'loadDataUsingJS',\n        value: function loadDataUsingJS() {\n            var _this = this;\n\n            var _promiseFn = function _promiseFn(_success, _reject) {\n                var request = new XMLHttpRequest();\n                request.onload = function () {\n                    switch (request.status) {\n                        case 200:\n                            _success(request.response);\n                            break;\n                        case 404:\n                            console.log('error: service url not found');\n                            _reject(Error(request.statusText));\n                            break;\n                        default:\n                            _reject(Error(request.statusText));\n                            break;\n                    }\n                };\n                // Handle network errors\n                request.onerror = function () {\n                    _reject(Error('Network Error'));\n                };\n                request.open('GET', _this.bbURL);\n                request.send();\n            };\n            var promise = new Promise(_promiseFn);\n            return promise;\n        }\n    }]);\n\n    return BBProductAPIService;\n}();\n\nexports.default = BBProductAPIService;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQkJQcm9kdWN0QVBJU2VydmljZS5qcz83MDQ4Il0sIm5hbWVzIjpbIkJCUHJvZHVjdEFQSVNlcnZpY2UiLCJiYlVSTCIsIl9wcm9taXNlRm4iLCJfc3VjY2VzcyIsIl9yZWplY3QiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvbmxvYWQiLCJzdGF0dXMiLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJFcnJvciIsInN0YXR1c1RleHQiLCJvbmVycm9yIiwib3BlbiIsInNlbmQiLCJwcm9taXNlIiwiUHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFxQkEsbUI7QUFDakIsbUNBQWE7QUFBQTs7QUFDVCxhQUFLQyxLQUFMLEdBQWEsa01BQWI7QUFDSDs7OzswQ0FFZ0I7QUFBQTs7QUFDYixnQkFBSUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLFFBQUQsRUFBV0MsT0FBWCxFQUF1QjtBQUNwQyxvQkFBSUMsVUFBVSxJQUFJQyxjQUFKLEVBQWQ7QUFDQUQsd0JBQVFFLE1BQVIsR0FBaUIsWUFBTTtBQUNuQiw0QkFBT0YsUUFBUUcsTUFBZjtBQUNJLDZCQUFLLEdBQUw7QUFDSUwscUNBQVNFLFFBQVFJLFFBQWpCO0FBQ0E7QUFDSiw2QkFBSyxHQUFMO0FBQ0lDLG9DQUFRQyxHQUFSLENBQVksOEJBQVo7QUFDQVAsb0NBQVFRLE1BQU1QLFFBQVFRLFVBQWQsQ0FBUjtBQUNBO0FBQ0o7QUFDSVQsb0NBQVFRLE1BQU1QLFFBQVFRLFVBQWQsQ0FBUjtBQUNBO0FBVlI7QUFZSCxpQkFiRDtBQWNBO0FBQ0FSLHdCQUFRUyxPQUFSLEdBQWtCLFlBQVk7QUFDMUJWLDRCQUFRUSxNQUFNLGVBQU4sQ0FBUjtBQUNILGlCQUZEO0FBR0FQLHdCQUFRVSxJQUFSLENBQWEsS0FBYixFQUFvQixNQUFLZCxLQUF6QjtBQUNBSSx3QkFBUVcsSUFBUjtBQUNILGFBdEJEO0FBdUJBLGdCQUFJQyxVQUFVLElBQUlDLE9BQUosQ0FBWWhCLFVBQVosQ0FBZDtBQUNBLG1CQUFPZSxPQUFQO0FBQ0g7Ozs7OztrQkEvQmdCakIsbUIiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJCUHJvZHVjdEFQSVNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuYmJVUkwgPSBcImh0dHBzOi8vYXBpLnJlbWl4LmJlc3RidXkuY29tL3YxL3Byb2R1Y3RzKChjYXRlZ29yeVBhdGguaWQ9YWJjYXQwNTAxMDAwKSk/YXBpS2V5PThjY2RkZjRydGp6NWs1YnRxYW04NHFhayZmb3JtYXQ9anNvbiZzaG93PWltYWdlLHRodW1ibmFpbEltYWdlLHNob3J0RGVzY3JpcHRpb24sbmFtZSxyZWd1bGFyUHJpY2Usc2FsZVByaWNlLHNrdVwiO1xuICAgIH1cbiAgICBcbiAgICBsb2FkRGF0YVVzaW5nSlMoKXtcbiAgICAgICAgbGV0IF9wcm9taXNlRm4gPSAoX3N1Y2Nlc3MsIF9yZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2gocmVxdWVzdC5zdGF0dXMpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zdWNjZXNzKHJlcXVlc3QucmVzcG9uc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQwNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogc2VydmljZSB1cmwgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVqZWN0KEVycm9yKHJlcXVlc3Quc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlamVjdChFcnJvcihyZXF1ZXN0LnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBuZXR3b3JrIGVycm9yc1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9yZWplY3QoRXJyb3IoJ05ldHdvcmsgRXJyb3InKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHRoaXMuYmJVUkwpO1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShfcHJvbWlzZUZuKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIFxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL0JCUHJvZHVjdEFQSVNlcnZpY2UuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar BBProductData = function BBProductData(data) {\n    _classCallCheck(this, BBProductData);\n\n    this.from = data['from'];\n    this.to = data['to'];\n    this.total = data['total'];\n    this.currentPage = data['currentPage'];\n    this.totalPages = data['totalPages'];\n    this.queryTime = data['queryTime'];\n    this.totalTime = data['totalTime'];\n    this.partial = data['partial'];\n    this.canonicalUrl = data['canonicalUrl'];\n    this.products = data['products'];\n\n    // create a product object\n};\n\nexports.default = BBProductData;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvQkJQcm9kdWN0RGF0YS5qcz84NWZhIl0sIm5hbWVzIjpbIkJCUHJvZHVjdERhdGEiLCJkYXRhIiwiZnJvbSIsInRvIiwidG90YWwiLCJjdXJyZW50UGFnZSIsInRvdGFsUGFnZXMiLCJxdWVyeVRpbWUiLCJ0b3RhbFRpbWUiLCJwYXJ0aWFsIiwiY2Fub25pY2FsVXJsIiwicHJvZHVjdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQXFCQSxhLEdBQ2pCLHVCQUFhQyxJQUFiLEVBQW1CO0FBQUE7O0FBQ2YsU0FBS0MsSUFBTCxHQUFZRCxLQUFLLE1BQUwsQ0FBWjtBQUNBLFNBQUtFLEVBQUwsR0FBVUYsS0FBSyxJQUFMLENBQVY7QUFDQSxTQUFLRyxLQUFMLEdBQWFILEtBQUssT0FBTCxDQUFiO0FBQ0EsU0FBS0ksV0FBTCxHQUFtQkosS0FBSyxhQUFMLENBQW5CO0FBQ0EsU0FBS0ssVUFBTCxHQUFrQkwsS0FBSyxZQUFMLENBQWxCO0FBQ0EsU0FBS00sU0FBTCxHQUFpQk4sS0FBSyxXQUFMLENBQWpCO0FBQ0EsU0FBS08sU0FBTCxHQUFpQlAsS0FBSyxXQUFMLENBQWpCO0FBQ0EsU0FBS1EsT0FBTCxHQUFlUixLQUFLLFNBQUwsQ0FBZjtBQUNBLFNBQUtTLFlBQUwsR0FBb0JULEtBQUssY0FBTCxDQUFwQjtBQUNBLFNBQUtVLFFBQUwsR0FBZ0JWLEtBQUssVUFBTCxDQUFoQjs7QUFFQTtBQUNILEM7O2tCQWRnQkQsYSIsImZpbGUiOiI0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQkJQcm9kdWN0RGF0YSB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICAgICAgdGhpcy5mcm9tID0gZGF0YVsnZnJvbSddO1xuICAgICAgICB0aGlzLnRvID0gZGF0YVsndG8nXTtcbiAgICAgICAgdGhpcy50b3RhbCA9IGRhdGFbJ3RvdGFsJ107XG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBkYXRhWydjdXJyZW50UGFnZSddO1xuICAgICAgICB0aGlzLnRvdGFsUGFnZXMgPSBkYXRhWyd0b3RhbFBhZ2VzJ107XG4gICAgICAgIHRoaXMucXVlcnlUaW1lID0gZGF0YVsncXVlcnlUaW1lJ107XG4gICAgICAgIHRoaXMudG90YWxUaW1lID0gZGF0YVsndG90YWxUaW1lJ107XG4gICAgICAgIHRoaXMucGFydGlhbCA9IGRhdGFbJ3BhcnRpYWwnXTtcbiAgICAgICAgdGhpcy5jYW5vbmljYWxVcmwgPSBkYXRhWydjYW5vbmljYWxVcmwnXTtcbiAgICAgICAgdGhpcy5wcm9kdWN0cyA9IGRhdGFbJ3Byb2R1Y3RzJ107XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgcHJvZHVjdCBvYmplY3RcbiAgICB9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbW9kZWwvQkJQcm9kdWN0RGF0YS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Catalog = function () {\n    function Catalog() {\n        //\n\n        _classCallCheck(this, Catalog);\n    }\n\n    _createClass(Catalog, [{\n        key: 'showCatalogProducts',\n        value: function showCatalogProducts(products) {\n            console.log('createTableOfItems();');\n            var productCell = \"\";\n            // count the number of products (should be 10)\n            for (var itemCount = 0; itemCount < products.length; itemCount++) {\n                console.log('in for loop');\n                // produce a \"table\" of items\n                var currentItem = products[itemCount];\n                productCell += '<div class=\"product-wrapper\" style=\"position: absolute; left:' + itemCount * 530 + '\" >';\n                productCell += '<img src=\"' + currentItem[\"image\"] + '\" alt=\"' + currentItem[\"name\"] + '\" title=\"' + currentItem[\"name\"] + '\" height=\"250\" width=\"250\">';\n                productCell += '<p>' + currentItem[\"name\"] + '<br>' + currentItem[\"salePrice\"] + '</p>';\n                productCell += '<button type=\\'button\\' id=\\'quickView-' + currentItem['sku'] + '\\' data-sku=\\'' + currentItem['sku'] + '\\'>Quick View</button>';\n                productCell += '<button type=\\'button\\' id=\\'' + currentItem['sku'] + '\\' data-sku=\\'' + currentItem['sku'] + '\\'>Add To Cart</button>';\n                productCell += '</div>';\n                productCell += '\\n';\n            }\n            return productCell;\n        }\n    }]);\n\n    return Catalog;\n}();\n\nexports.default = Catalog;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQ2F0YWxvZy5qcz82Yzk4Il0sIm5hbWVzIjpbIkNhdGFsb2ciLCJwcm9kdWN0cyIsImNvbnNvbGUiLCJsb2ciLCJwcm9kdWN0Q2VsbCIsIml0ZW1Db3VudCIsImxlbmd0aCIsImN1cnJlbnRJdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxPO0FBQ2pCLHVCQUFhO0FBQ1Q7O0FBRFM7QUFFWjs7Ozs0Q0FFbUJDLFEsRUFBUztBQUN6QkMsb0JBQVFDLEdBQVIsQ0FBWSx1QkFBWjtBQUNBLGdCQUFJQyxjQUFhLEVBQWpCO0FBQ0E7QUFDQSxpQkFBSyxJQUFJQyxZQUFVLENBQW5CLEVBQXNCQSxZQUFVSixTQUFTSyxNQUF6QyxFQUFpREQsV0FBakQsRUFBNkQ7QUFDekRILHdCQUFRQyxHQUFSLENBQVksYUFBWjtBQUNBO0FBQ0Esb0JBQUlJLGNBQWNOLFNBQVNJLFNBQVQsQ0FBbEI7QUFDQUQsK0JBQWUsa0VBQWdFQyxZQUFVLEdBQTFFLEdBQThFLEtBQTdGO0FBQ0FELCtCQUFlLGVBQWFHLFlBQVksT0FBWixDQUFiLEdBQWtDLFNBQWxDLEdBQTRDQSxZQUFZLE1BQVosQ0FBNUMsR0FBZ0UsV0FBaEUsR0FBNEVBLFlBQVksTUFBWixDQUE1RSxHQUFnRyw2QkFBL0c7QUFDQUgsK0JBQWUsUUFBTUcsWUFBWSxNQUFaLENBQU4sR0FBMEIsTUFBMUIsR0FBaUNBLFlBQVksV0FBWixDQUFqQyxHQUEwRCxNQUF6RTtBQUNBSCwrQkFBZSw0Q0FBd0NHLFlBQVksS0FBWixDQUF4QyxzQkFBOEVBLFlBQVksS0FBWixDQUE5RSwyQkFBZjtBQUNBSCwrQkFBZSxrQ0FBOEJHLFlBQVksS0FBWixDQUE5QixzQkFBb0VBLFlBQVksS0FBWixDQUFwRSw0QkFBZjtBQUNBSCwrQkFBZSxRQUFmO0FBQ0FBLCtCQUFlLElBQWY7QUFDSDtBQUNELG1CQUFPQSxXQUFQO0FBQ0g7Ozs7OztrQkF0QmdCSixPIiwiZmlsZSI6IjUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDYXRhbG9nIHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAvL1xuICAgIH1cbiAgICBcbiAgICBzaG93Q2F0YWxvZ1Byb2R1Y3RzKHByb2R1Y3RzKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVRhYmxlT2ZJdGVtcygpOycpO1xuICAgICAgICBsZXQgcHJvZHVjdENlbGwgPVwiXCI7XG4gICAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgcHJvZHVjdHMgKHNob3VsZCBiZSAxMClcbiAgICAgICAgZm9yIChsZXQgaXRlbUNvdW50PTA7IGl0ZW1Db3VudDxwcm9kdWN0cy5sZW5ndGg7IGl0ZW1Db3VudCsrKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbiBmb3IgbG9vcCcpO1xuICAgICAgICAgICAgLy8gcHJvZHVjZSBhIFwidGFibGVcIiBvZiBpdGVtc1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRJdGVtID0gcHJvZHVjdHNbaXRlbUNvdW50XTtcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8ZGl2IGNsYXNzPVwicHJvZHVjdC13cmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6JytpdGVtQ291bnQqNTMwKydcIiA+JztcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8aW1nIHNyYz1cIicrY3VycmVudEl0ZW1bXCJpbWFnZVwiXSsnXCIgYWx0PVwiJytjdXJyZW50SXRlbVtcIm5hbWVcIl0rJ1wiIHRpdGxlPVwiJytjdXJyZW50SXRlbVtcIm5hbWVcIl0rJ1wiIGhlaWdodD1cIjI1MFwiIHdpZHRoPVwiMjUwXCI+JztcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8cD4nK2N1cnJlbnRJdGVtW1wibmFtZVwiXSsnPGJyPicrY3VycmVudEl0ZW1bXCJzYWxlUHJpY2VcIl0rJzwvcD4nO1xuICAgICAgICAgICAgcHJvZHVjdENlbGwgKz0gYDxidXR0b24gdHlwZT0nYnV0dG9uJyBpZD0ncXVpY2tWaWV3LWAgK2N1cnJlbnRJdGVtWydza3UnXSArIGAnIGRhdGEtc2t1PSdgICsgY3VycmVudEl0ZW1bJ3NrdSddICsgYCc+UXVpY2sgVmlldzwvYnV0dG9uPmA7XG4gICAgICAgICAgICBwcm9kdWN0Q2VsbCArPSBgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGlkPSdgICtjdXJyZW50SXRlbVsnc2t1J10gKyBgJyBkYXRhLXNrdT0nYCArIGN1cnJlbnRJdGVtWydza3UnXSArIGAnPkFkZCBUbyBDYXJ0PC9idXR0b24+YDtcbiAgICAgICAgICAgIHByb2R1Y3RDZWxsICs9ICc8L2Rpdj4nO1xuICAgICAgICAgICAgcHJvZHVjdENlbGwgKz0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2R1Y3RDZWxsO1xuICAgIH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9DYXRhbG9nLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);