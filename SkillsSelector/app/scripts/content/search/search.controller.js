/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * <!-- @author: Benzaouia Soufiane-->
 */


// Contrôleur de la page d'accueil
skillsSelectorApp.controller('SearchController',
        function ($scope, ngDialog, Data,Webservice, $http, toaster) {
            $scope.skill = {};
            $scope.myData = [];
            $scope.titles = ["Senior", "Junior", "Manager", "Confirme"];
            $scope.activeProfileSearch = false;
	 
   	 	    

            $scope.search = function (name, title) {
                var skill = {};
                if (!_.isUndefined(name)) {
                    skill.name = name.display;
                }
                if (!_.isUndefined(title)) {
                    skill.title = title;
                }
                var query = "MATCH (m:`Profile`)-[r:ParentOF]-(n:`Skill`) ";
                if (!_.isUndefined(skill) && !_.isUndefined(skill.name) && !_.isNull(skill.name) && skill.name != '') {
                    query += "WHERE n.name =~ '(?i)" + skill.name + "' ";
                } else if (_.isUndefined(skill) || _.isUndefined(skill.name) || skill.name == '') {
                    query += "WHERE n.name =~ '(?i).*' "
                }
                if (!_.isUndefined(skill) && !_.isUndefined(skill.title) && !_.isNull(skill.title)) {
                    query += " AND  m.title =~ '(?i)" + skill.title + "' ";
                } else {

                    query += " AND  m.title =~ '(?i).*' ";
                }
                query += " RETURN  DISTINCT m.`name` AS `nom`,m.`profile` AS `profile`,n.`name` AS `name`, n.`experience` as `experience`";
                Data.post('cypher', {
                    // query: "MATCH (n:`Skill`) WHERE has(n.`type`) RETURN DISTINCT n.`type` AS `type`"
                    //   query: "MATCH (m:`Profile`)-[r:ParentOF]-(n:`Skill`) WHERE n.name =~ '(?i)"+skill.name +"' OR  m.name =~ '(?i)"+skill.title +"' RETURN  DISTINCT m.`name` AS `nom`,m.`profile` AS `profile`,n.`name` AS `name`, n.`experience` as `experience` "            
                    query: query
                }).then(function (results) {
                    $scope.myData = [];
 		   $scope.gridOptions.data = [];
		
                    _.map(results.data, function (m) {
                        var result = {};
                        result.Nom = _.first(m).toUpperCase();
                        result.Profile = m['1'].toUpperCase();
                        result.Competence = m['2'];
                        result.Experience = _.last(m);
                        $scope.myData.push(result);
                    })
                    $scope.gridOptions.data = $scope.myData;
		    $scope.columns = [{field: 'Nom'}, {field:'Profile'},{field: 'Competence'}, {field:'Experience'}];
                    $scope.gridOptions.columnDefs = $scope.columns;
		 
                });
            }


////            $scope.activeProfile = function (title) {
////                $scope.activeProfileSearch = !$scope.activeProfileSearch; 
////                if (!_.isUndefined(title)) {
////                    title = '';
////                }
//
//            }
            $scope.buildGraph = function (name, title) {
                var skill = {};
                skill.name = name.display;
                skill.title = title;
                d3.select("svg").remove();

                var query = "MATCH path = (m:`Profile`)-[r:ParentOF]-(n:`Skill`) ";
                if (!_.isUndefined(skill) && !_.isUndefined(skill.name) && !_.isNull(skill.name) && skill.name != '') {
                    query += "WHERE n.name =~ '(?i)" + skill.name + "' ";
                } else if (_.isUndefined(skill) || _.isUndefined(skill.name) || skill.name == '') {
                    query += "WHERE n.name =~ '(?i).*' "
                }
                if (!_.isUndefined(skill) && !_.isUndefined(skill.title) && !_.isNull(skill.title)) {
                    query += " AND  m.title =~ '(?i)" + skill.title + "' ";
                } else {

                    query += " AND  m.title =~ '(?i).*' ";
                }
                query += " RETURN path ";

                d3.select("svg").remove();
                ////////////init types/////////////////////
                Data.post('transaction/commit', {
                    "statements": [{"statement": query, "resultDataContents": ["graph"], "includeStats": true}]
                            // "statements": [{"statement": $scope.query, "resultDataContents": ["graph"], "includeStats": true}]
                            //    "statements": [{"statement": "START a = node(0,1), b = node(0,1)\nMATCH a -[r]-> b RETURN r;", "resultDataContents": ["row", "graph"], "includeStats": true}]
                }).then(function (results) {
                    function idIndex(a, id) {
                        for (var i = 0; i < a.length; i++) {
                            if (a[i].id == id)
                                return i;
                        }
                        return null;
                    }
                    var nodes = [], links = [];
                    var labelColor = {init: 1};
                    var rand = 1;
                    results.results[0].data.forEach(function (row) {
                        row.graph.nodes.forEach(function (n) {
                            rand += 1;
                            // var label = n.labels[1] + ":" + n.labels[0];
                            var label = n.labels[0];
                            labelColor[label] = rand;
                            if (idIndex(nodes, n.id) == null)
                                nodes.push({id: n.id, label: label, title: n.properties.name});
                        });
                        links = links.concat(row.graph.relationships.map(function (r) {
                            return {source: idIndex(nodes, r.startNode), target: idIndex(nodes, r.endNode), type: r.type};
                        }));
                    });
                    var graph = {nodes: nodes, links: links};
                    var w = 1500, h = 400;

                    var force = d3.layout.force().linkDistance(100)
                            .charge(-500).size([w, h]);
                    var svg = d3.select("#graph").append("svg")
                            .attr("viewBox", "0 0 " + w + " " + h)
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .attr("width", w).attr("height", h)
                            .attr("pointer-events", "all");
                    $scope.del = 1;
                    force.nodes(graph.nodes)
                            .links(graph.links)
                            .start();
                    var color = d3.scale.ordinal()
                            .domain(["foo", "bar", "baz"])
                            .range(["#1de9b6", "#BDBDBD"]);
                    // render relationships as lines
                    var link = svg.selectAll(".link")
                            .data(graph.links);
                    link.enter().append("line").attr("class", "link").attr("style", "fill:#A4A4A4; stroke:#A4A4A4; stroke-opacity:0.5;stroke-width: 2px;");
                    var node = svg.selectAll(".node")
                            .data(graph.nodes)
                            .enter().append("svg:g")
                            .on("mouseover", mouseover)
                            .on("mouseout", mouseout)
                            .on("dblclick", click)
                            .call(force.drag);

                    var circle = node.append("circle")
                            .attr("class", "node")
                            .attr("id", function (d) {
                                return d.id;
                            }).attr("data-legend", function (d) {
                        var str = d.label;
                        return str;
                    })
                            .attr("r", 30)
                            .style("fill", function (d) {
                                var col = d.label;
                                if (typeof col == "undefined") {
                                    return color(labelColor.init);
                                } else {
                                    return color(labelColor[col]);
                                }
                            }).style("stroke", "#555")
                            .style("stroke-width", "3px");

                    node.append("text")
                            .text(function (d) {
                                if (typeof d.title == "undefined") {
                                    d.title = "undefined";
                                    return d.id;
                                }
                                else {
                                    if (/\s/.test(d.title)) {
                                        var splits = d.title.split(" ");

                                        return (splits[0] + "...");
                                        //  return d.title.replace(/\s/g, '\n');
                                    }
                                    else {
                                        return d.title;
                                    }
                                }
                            }).style("text-anchor", "middle").style("fill", "#555")
                            .style("font-family", "Arial").style("font-size", 10)

                    // html title attribute for title node-attribute
                    node.append("title")
                            .text(function (d) {

                                if (typeof d.label == "undefined") {
                                    d.title = "undefined";
                                    return d.id;
                                }
                                else {

                                    return d.label;

                                }

                            })
                    legend = svg.append("g")
                            .attr("class", "legend")
                            .attr("transform", "translate(50,30)")
                            .style("font-size", "12px")
                            .call(d3.legend)
                    // force feed algo ticks for coordinate computation
                    force.on("tick", function () {
                        link.attr("x1", function (d) {
                            return d.source.x;
                        })
                                .attr("y1", function (d) {
                                    return d.source.y;
                                })
                                .attr("x2", function (d) {
                                    return d.target.x;
                                })
                                .attr("y2", function (d) {
                                    return d.target.y;
                                });
                        node.attr("transform", function (d) {

                            return 'translate(' + [d.x, d.y] + ')';
                        });
                    });
                    function mouseover() {
                        d3.select(this).select('circle')
                                .transition()
                                .duration(250)
                                .attr("r", 60);
                        d3.select(this).select('text')
                                .transition()
                                .duration(300)
                                .text(function (d) {
                                    return d.title;
                                })
                                .style("font-size", "15px")


                    }

                    function mouseout() {
                        d3.select(this).select('circle')
                                .transition()
                                .duration(250)
                                .attr("r", 30);

                        d3.select(this).select('text')
                                .transition()
                                .duration(300)
                                .text(function (d) {
                                    if (/\s/.test(d.title)) {
                                        var splits = d.title.split(" ");
                                        return (splits[0] + "...");
                                    }
                                    else {
                                        return d.title;
                                    }
                                })
                                .style("text-anchor", "middle").style("fill", "#555")
                                .style("font-size", 10)
                    }

                    function click() {
                        Data.post('transaction/commit', {
                            "statements": [{"statement": "START a = node(" + d3.select(this).node().__data__.id + ")" + "  MATCH  path =(a)-[r]->(m) RETURN r limit 4", "resultDataContents": ["row", "graph"], "includeStats": true}]

                        }
                        ).then(function (results) {
                            var rand1 = 0;
                            results.results[0].data.forEach(function (row) {
                                row.graph.nodes.forEach(function (n) {
                                    rand += 1;
                                    var label = n.labels[0];
                                    labelColor[label] = rand;

                                    if (idIndex(nodes, n.id) == null)
                                        nodes.push({id: n.id, label: label, title: n.properties.name});
                                });

                                links = links.concat(row.graph.relationships.map(function (r) {
                                    return {source: idIndex(nodes, r.startNode), target: idIndex(nodes, r.endNode), type: r.type};
                                }));
                            });
                            d3.select("svg").remove();
                            graph = {nodes: nodes, links: links};
                            var w = 1500, h = 400;

                            var force = d3.layout.force().linkDistance(120)
                                    .charge(-600).size([w, h]);
                            var svg = d3.select("#graph").append("svg")
                                    .attr("viewBox", "0 0 " + w + " " + h)
                                    .attr("preserveAspectRatio", "xMidYMid meet")
                                    .attr("width", w).attr("height", h)
                                    .attr("pointer-events", "all");

                            force.nodes(graph.nodes)
                                    .links(graph.links)
                                    .start();
                            var color = d3.scale.ordinal()
                                    .domain(["foo", "bar", "baz"])
                                    .range(["#1de9b6", "#BDBDBD"]);
                            var link = svg.selectAll(".link")
                                    .data(graph.links);
                            link.enter().append("line").attr("class", "link").attr("style", "fill:#A4A4A4; stroke:#A4A4A4; stroke-opacity:0.5;stroke-width: 2px;");


                            var node = svg.selectAll(".node")
                                    .data(graph.nodes)
                                    .enter().append("svg:g")
                                    .on("mouseover", mouseover)
                                    .on("mouseout", mouseout)
                                    .on("dblclick", click)
                                    .call(force.drag);

                            // render relationships as lines

                            var circle = node.append("circle")
                                    .attr("class", "node")
                                    .attr("id", function (d) {
                                        return d.id;
                                    }).attr("data-legend", function (d) {
                                var str = d.label;
                                return str;
                            })
                                    .attr("r", 30)
                                    .style("fill", function (d) {
                                        var col = d.label;
                                        if (typeof col == "undefined") {

                                            return color(labelColor.init);
                                        } else {
                                            return color(labelColor[col]);
                                        }

                                    }).style("stroke", "#555")
                                    .style("stroke-width", "3px");

                            node.append("text")
                                    .text(function (d) {
                                        if (typeof d.title == "undefined") {
                                            d.title = "undefined";
                                            return d.id;
                                        }
                                        else {
                                            if (/\s/.test(d.title)) {
                                                var splits = d.title.split(" ");

                                                return (splits[0] + "...");
                                                //  return d.title.replace(/\s/g, '\n');
                                            }
                                            else {
                                                return d.title;
                                            }
                                        }


                                    }).style("text-anchor", "middle").style("fill", "#555")
                                    .style("font-family", "Arial").style("font-size", 10)


                            // html title attribute for title node-attribute
                            node.append("title")
                                    .text(function (d) {

                                        if (typeof d.label == "undefined") {
                                            d.title = "undefined";
                                            return d.title;
                                        }
                                        else {

                                            return d.label;

                                        }

                                    })

                            legend = svg.append("g")
                                    .attr("class", "legend")
                                    .attr("transform", "translate(50,30)")
                                    .style("font-size", "12px")
                                    .call(d3.legend)
                            // force feed algo ticks for coordinate computation
                            force.on("tick", function () {
                                link.attr("x1", function (d) {
                                    return d.source.x;
                                })
                                        .attr("y1", function (d) {
                                            return d.source.y;
                                        })
                                        .attr("x2", function (d) {
                                            return d.target.x;
                                        })
                                        .attr("y2", function (d) {
                                            return d.target.y;
                                        });
                                node.attr("transform", function (d) {

                                    return 'translate(' + [d.x, d.y] + ')';
                                });
                            });
                        });



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

            $scope.gridOptions = {
                exporterMenuCsv: true,
                enableGridMenu: true,
		columnDefs: $scope.columns
            }
            
            $scope.skillName = '';
            $scope.skillExp = '';
            $scope.skillsArray = [];
            $scope.add = function (a, b) {
                if (!_.isUndefined(a) && !_.isNull(a) && a != '') {
                    if (!_.isUndefined(b) && !_.isNull(b) && b != '') {
                        $scope.skillsArray.push({name: a, exp: b});
                    } else {
                        $scope.skillsArray.push({name: a, exp: '-1'});
                    }
                }
                a = '';
                b = '';
            }

            
            $scope.advancedsearch= function(skillsArray){
                var req = {
 			method: 'POST',
 			url: 'http://localhost:8081/skillSelectorAPI/GetProfiles',
			 headers: {
 				  'Content-Type': undefined
				 },
			
				 data: skillsArray
				}

		$http(req).then(
			function (results) {
                    		console.log(results.data);
			$scope.myData = [];
			$scope.gridOptions.data = [];
			

			var transform = _.pairs(results.data);
                    _.map(transform, function (m) {
			console.log(m);
                        var result = {};
                        result.Nom = _.first(m).toUpperCase();
                        result.Score = _.first(_.last(m)) + ' %';
                        $scope.myData.push(result);
                    })
                    $scope.gridOptions.data = $scope.myData;
 		     $scope.columns = [{field: 'Nom'},{field: 'Score'}];
                   $scope.gridOptions.columnDefs = $scope.columns;	
					}, 
			function (results) {
                    		console.log(results);
			
			}
		);
               
                
                
            }

            $scope.init = function () {
                $scope.skills = [];
                $scope.titles = [];
                // list of `state` value/display objects
                Data.post('cypher', {
                    query: "MATCH (n:`Skill`)  RETURN DISTINCT n.`name` AS `name`"

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


        });

        
