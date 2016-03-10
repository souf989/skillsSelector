skillsSelectorApp.factory("Webservice", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to REST API

        var serviceBase = 'http://localhost:8081/skillSelectorAPI/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 5000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);
