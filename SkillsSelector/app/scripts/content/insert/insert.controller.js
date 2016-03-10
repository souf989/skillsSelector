/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * <!-- @author: Benzaouia Soufiane-->
 */


// Contrôleur de la page d'accueil
skillsSelectorApp.controller('InsertController',
        function ($scope, ngDialog, $mdToast, Data, $http, toaster) {
            $scope.titles = ["Senior", "Junior", "Manager", "Confirme"];
            // multiple competences 
            $scope.todos = [1];
            var inc = 1;
            $scope.addSkill = function (skill) {
                console.log(skill);
                console.log($scope.todos);
                inc = skill.name + '_' + skill.experience;
                $scope.todos.push(inc);
            }



            $scope.createProfile = function (user) {
                console.log(user)
                var skills = [];
                var skill = {};
                var name = user.name.toUpperCase() + '_' + user.firstName.toUpperCase();
                skill.name = user.skill.toUpperCase();
                skill.exp = user.experience;
                skills.push(skill);
                Data.post('cypher', {
                    query: "MATCH (n:`Profile`) WHERE n.`name` = '" + user.name + "' RETURN DISTINCT n.`name`"

                }).then(function (results) {
                    console.log(results);
                    if (results.data.length == 0) {
                        var nodes = "(n:Profile {name :'" + user.name + "', firstname :'" + user.firstName + "',profile :'" + user.profile + "',  title:'" + user.title + "'})";
                        skills = _.map(skills, function (m) {
                            return "(" + m.name + ":Skill {name :'" + m.name + "', experience :'" + m.exp + "'})"
                        });
                        skills = _.map(skills, function (m) {
                            return " MERGE " + nodes + "  CREATE UNIQUE (n)-[r:ParentOF]->" + m + " return n";
                        })
                        // nodes = nodes + _.reduce(skills,function(m,n){return m + n ; },',');
                        _.each(skills, function (n) {
                            Data.post('cypher', {
                                query: n
                            }).then(function (results) {
                                toaster.pop("success", "", "Profile Created ", 5000, 'trustedHtml');
                            })
                        })

                    } else {
                        skills = _.map(skills, function (m) {
                            return "(" + m.name + ":Skill {name :'" + m.name + "', experience :'" + m.exp + "'})"
                        });
                        skills = _.map(skills, function (m) {
                            return "MATCH (n:`Profile`) WHERE n.`name` = '" + user.name + "'   CREATE UNIQUE (n)-[r:ParentOF]->" + m + " return n";
                        })
                        _.each(skills, function (n) {
                            Data.post('cypher', {
                                query: n
                            }).then(function (results) {
                                toaster.pop("success", "", "Skills Created ", 5000, 'trustedHtml');
                            })
                        })
                        //toaster.pop("error", "", "The Profile "+user.name+" is already Created ", 5000, 'trustedHtml');
                    }
                });
                }
                $scope.querySearch = function (query) {
                    var results = query ? $scope.skills.filter(createFilterFor(query)) : $scope.skills,
                            deferred;
                    return results;
                };


                function createFilterFor(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(state) {
                        return (state.value.indexOf(lowercaseQuery) === 0);
                    };
                }

                $scope.init = function () {
                    $scope.skills = [];
                    $scope.titles = [];
                    // list of `state` value/display objects
                    Data.post('cypher', {
                        query: "MATCH (n:`Profile`)  RETURN DISTINCT n.`name` AS `name`"

                    }).then(function (results) {
                        _.map(results.data, function (m) {
                            $scope.skills.push({
                                value: _.first(m).toLowerCase(),
                                display: _.first(m)
                            });

                            $scope.titles.push(_.first(m));
                        });
                    });
                }

                /*
                 
                 */

            


        });

        
