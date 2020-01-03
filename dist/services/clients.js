"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ClientService = /** @class */ (function () {
    function ClientService() {
        var _this = this;
        this.addClient = function (clientId, userId) {
            _this.clients[userId] = _this.clients[userId]
                ? __spreadArrays(_this.clients[userId], [clientId]) : [clientId];
        };
        this.removeClient = function (clientId, userId) {
            _this.clients[userId] = _this.clients[userId].filter(function (id) { return id !== clientId; });
        };
        this.removeUser = function (userId) { return delete _this.clients[userId]; };
        this.hasClients = function (userId) { return (Boolean(_this.getClientsByUserId(userId).length)); };
        this.getClientsByUserId = function (userId) { return (_this.clients[userId]
            ? _this.clients[userId]
            : []); };
        this.clients = {};
    }
    return ClientService;
}());
exports.ClientService = ClientService;
exports.clients = new ClientService();
