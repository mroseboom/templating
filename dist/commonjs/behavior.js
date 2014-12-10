"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

exports.hyphenate = hyphenate;
var getAllAnnotations = require('aurelia-metadata').getAllAnnotations;
var getAnnotation = require('aurelia-metadata').getAnnotation;
var ResourceType = require('aurelia-metadata').ResourceType;
var TaskQueue = require('aurelia-task-queue').TaskQueue;
var ObserverLocator = require('aurelia-binding').ObserverLocator;
var BehaviorInstance = require('./behavior-instance').BehaviorInstance;
var Children = require('./children').Children;


var capitalMatcher = /([A-Z])/g;

function addHyphenAndLower(char) {
  return "-" + char.toLowerCase();
}

function hyphenate(name) {
  return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
}

var Property = function Property(name, changeHandler, attribute, defaultValue) {
  this.name = name;
  this.changeHandler = changeHandler;
  this.attribute = attribute || hyphenate(name);
  this.defaultValue = defaultValue;
};

exports.Property = Property;
var Behavior = (function (ResourceType) {
  var Behavior = function Behavior() {
    this.properties = [];
    this.propertyLookupByAttribute = {};
  };

  _extends(Behavior, ResourceType);

  Behavior.prototype.setTarget = function (container, target) {
    var _this = this;
    var proto = target.prototype;

    this.target = target;
    this.taskQueue = container.get(TaskQueue);
    this.observerLocator = container.get(ObserverLocator);

    this.handlesCreated = ("created" in proto);
    this.handlesBind = ("bind" in proto);
    this.handlesUnbind = ("unbind" in proto);
    this.handlesAttached = ("attached" in proto);
    this.handlesDetached = ("detached" in proto);

    getAllAnnotations(target, Property).forEach(function (property) {
      return _this.configureProperty(property);
    });

    this.childExpression = getAnnotation(target, Children);
  };

  Behavior.prototype.getPropertyForAttribute = function (attribute) {
    return this.propertyLookupByAttribute[attribute];
  };

  Behavior.prototype.configureProperty = function (property) {
    if (!property.changeHandler) {
      var handlerName = property.name + "Changed";
      if (handlerName in this.target.prototype) {
        property.changeHandler = handlerName;
      }
    }

    this.properties.push(property);
    this.propertyLookupByAttribute[property.attribute] = property;
  };

  Behavior.prototype.compile = function (compiler, resources, node, instruction) {
    instruction.suppressBind = true;
    return node;
  };

  Behavior.prototype.create = function (container, instruction) {
    var executionContext = instruction.executionContext || container.get(this.target);
    return new BehaviorInstance(this.taskQueue, this.observerLocator, this, executionContext, instruction);
  };

  return Behavior;
})(ResourceType);

exports.Behavior = Behavior;