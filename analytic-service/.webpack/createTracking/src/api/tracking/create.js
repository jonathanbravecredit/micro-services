(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@shiftcoders/dynamo-easy");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("ajv");

/***/ }),
/* 3 */
/***/ (function(module) {

module.exports = JSON.parse("{\"type\":\"object\",\"properties\":{\"id\":{\"type\":\"string\",\"nullable\":false},\"event\":{\"type\":\"string\",\"nullable\":false},\"sub\":{\"type\":\"string\",\"nullable\":true},\"session\":{\"type\":\"string\",\"nullable\":false},\"source\":{\"type\":\"string\",\"nullable\":false},\"value\":{\"type\":\"number\",\"nullable\":false}},\"required\":[\"id\",\"event\",\"sub\",\"session\",\"source\"],\"additionalProperties\":true}");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "main", function() { return /* binding */ main; });

// EXTERNAL MODULE: external "source-map-support/register"
var register_ = __webpack_require__(0);

// EXTERNAL MODULE: external "reflect-metadata"
var external_reflect_metadata_ = __webpack_require__(4);

// EXTERNAL MODULE: external "@shiftcoders/dynamo-easy"
var dynamo_easy_ = __webpack_require__(1);

// CONCATENATED MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/lib/models/analytics.model.ts


var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = undefined && undefined.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let Analytics = class Analytics {};

__decorate([Object(dynamo_easy_["PartitionKey"])(), __metadata("design:type", String)], Analytics.prototype, "id", void 0);

__decorate([Object(dynamo_easy_["SortKey"])(), __metadata("design:type", String)], Analytics.prototype, "event", void 0);

Analytics = __decorate([Object(dynamo_easy_["Model"])({
  tableName: 'Analytics'
})], Analytics);

class AnalyticsMaker {
  constructor(id, event, sub, session, source, value = 1) {
    this.id = id;
    this.event = event;
    this.sub = sub;
    this.session = session;
    this.source = source;
    this.value = value;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }

}
// CONCATENATED MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/lib/queries/analytics/analytics.queries.ts



const store = new dynamo_easy_["DynamoStore"](Analytics);
const getAnalytics = analyticId => {
  return store.get(analyticId).exec().then(res => res).catch(err => err);
};
const listAnalyticss = () => {
  return store.scan().execFetchAll().then(res => res).catch(err => err);
};
const createAnalytics = Analytics => {
  return store.put(Analytics).ifNotExists().exec().then(res => res).catch(err => err);
};
const deleteAnalytics = analyticId => {
  return store.delete(analyticId).returnValues('ALL_OLD').exec().then(res => res).catch(err => err);
};
// CONCATENATED MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/lib/queries/index.ts



// EXTERNAL MODULE: external "ajv"
var external_ajv_ = __webpack_require__(2);
var external_ajv_default = /*#__PURE__*/__webpack_require__.n(external_ajv_);

// EXTERNAL MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/lib/schema/analytic_create.json
var analytic_create = __webpack_require__(3);
var analytic_create_namespaceObject = /*#__PURE__*/__webpack_require__.t(analytic_create, 2);

// CONCATENATED MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/lib/schema/validation.ts


const ajv = new external_ajv_default.a();

ajv.addSchema(analytic_create_namespaceObject, 'analyticCreate');
// CONCATENATED MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/lib/utils/response.ts

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
  },
  body: JSON.stringify(body, null, 2)
});
const success = body => response(200, body);
const failure = body => response(500, body);
// CONCATENATED MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/lib/utils/safeJson.ts


/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
const hasJsonStructure = str => {
  if (typeof str !== 'string') return false;

  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};
const safeParse = (data, eventKey) => {
  if (Object.prototype.hasOwnProperty.call(data, eventKey)) {
    if (hasJsonStructure(data[eventKey])) {
      return JSON.parse(data[eventKey]);
    }

    return data[eventKey];
  }

  if (hasJsonStructure(data)) {
    return JSON.parse(data);
  }

  return data;
};
// CONCATENATED MODULE: /Users/jonathanpizzolato/Projects/brave-credit/dev/services/marketing-services/analytic-service/src/api/tracking/create.ts




var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};






const main = proxyEvent => __awaiter(void 0, void 0, void 0, function* () {
  const payload = safeParse(proxyEvent, 'body');
  const validate = ajv.getSchema('analyticCreate');
  if (!validate || !validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    const {
      id,
      event,
      sub,
      session,
      source,
      value
    } = payload;
    const analytic = new AnalyticsMaker(id, event, sub, session, source, value);
    yield createAnalytics(analytic);
    return response(200, 'success');
  } catch (error) {
    return response(500, error);
  }
});

/***/ })
/******/ ])));
//# sourceMappingURL=create.js.map