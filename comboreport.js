var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var requests = require('request');
var rally = require('rally');
var queryUtils = rally.util.query;
var fs = require('fs');
var json2csv = require('json2csv');

var restApi = rally({
	apiKey: '_HSiq55uzTLKnoJO1qQTymYClsbsXS0Uhw8uGRME',
	requestOptions: {
    headers: {
      'X-RallyIntegrationName': 'My cool node.js program',
      'X-RallyIntegrationVendor': 'TrueBlue',
      'X-RallyIntegrationVersion': '1.0'
    }
  }
});

var bigStories = [];

function entireQuery() {
	restApi.query({
	    type: 'HierarchicalRequirement', //the type to query
	    start: 1, //the 1-based start index, defaults to 1
	    pageSize: 2, //the page size (1-200, defaults to 200)
	    limit: Infinity, //the maximum number of results to return- enables auto paging
	    //order: 'Rank', //how to sort the results
	    fetch: ['Name', 'c_GroomingState', 'Epic', 'FormattedID', 'Project', 'Parent', 'Iteration',
	    'ScheduleState', 'c_KanbanState', 'Tasks', 'Blocked', 'BlockedReason', 'c_ReleasePriority', 
	    'PlanEstimate', 'Projects', 'c_PreviousEstimate', 'State', 'c_StoryRank', 'c_EpicRank', 'c_TPO', 'Milestones', 'Owner',
	    'LeafStoryPlanEstimateTotal', 'AcceptedLeafStoryPlanEstimateTotal', 'LeafStoryCount', 'UnEstimatedLeafStoryCount',
	    'AcceptedLeafStoryCount', 'Ready', 'Release', 'AcceptedDate', 'c_GAPS', 'c_Architect', 'ReleaseDate', 'ReleaseStartDate'],
	   	query: queryUtils.where('Project', '=', '/project/50982925414') //info dev
	   	.or('Project', '=', '/project/50982926429') //finance
        .or('Project', '=', '/project/50983112863') //qwod
        .or('Project', '=', '/project/49998887731') //prism
        .or('Project', '=', '/project/50982923609') //core
        .or('Project', '=', '/project/55635571848') //db migration
        .or('Project', '=', '/project/56200604007') //prism dev
        .and('DirectChildrenCount', '<', '1'),
	    
	    scope: {
	    	workspace: '/workspace/48926045219',
	    },
	    requestOptions: {} //optional additional options to pass through to request
	}, function(error, result) {
	    if(error) {
	        console.log(error);
	    } else {

	        var theResults = result.Results;
	        //console.log(theResults[0].Epic.Release);
	       	for (var i = 0; i <= theResults.length-1; i++) {
	        	
	        	bigStories.push(theResults[i]);
	        	if (theResults[i].Epic == null) {
	        		bigStories[i].Epic = null;
	        	} else if (theResults[i].Epic.Parent == null){
	        		bigStories[i].Epic.Parent = null;
	        	} else {
	        		bigStories[i].Theme = theResults[i].Epic.Parent;
	        	}
	        
	        }
	       	entireQuery2();
	    }
	});
};

function entireQuery2() {
	restApi.query({
	    type: 'Defect', //the type to query
	    start: 1, //the 1-based start index, defaults to 1
	    pageSize: 2, //the page size (1-200, defaults to 200)
	    limit: Infinity, //the maximum number of results to return- enables auto paging
	    //order: 'Rank', //how to sort the results

	    fetch: ['Name', 'FormattedID', 'Project', 'Parent', 'Iteration',
	    'ScheduleState', 'c_KanbanState', 'Tasks', 'Blocked', 'BlockedReason', 'c_ReleasePriority', 
	    'PlanEstimate', 'Projects', 'c_TPO', 'Milestones', 'Owner',
	    'Ready', 'Release', 'AcceptedDate', 'c_Architect', 'ReleaseDate', 'ReleaseStartDate'],

	   	query: queryUtils.where('Project', '=', '/project/50982925414') //info dev
	   	.or('Project', '=', '/project/50982926429') //finance
        .or('Project', '=', '/project/50983112863') //qwod
        .or('Project', '=', '/project/49998887731') //prism
        .or('Project', '=', '/project/50982923609') //core
        .or('Project', '=', '/project/55635571848') //db migration
        .or('Project', '=', '/project/56200604007'), //prism dev        
	    
	    scope: {
	    	workspace: '/workspace/48926045219',
	    },
	    requestOptions: {} //optional additional options to pass through to request
	}, function(error, result) {
	    if(error) {
	        console.log(error);
	    } else {

            var fields = ['Theme.FormattedID', 'Theme.Name', 'Theme.State.Name','Theme.c_Projects', 'Theme.c_ReleasePriority', 
            'Epic.c_EpicRank', 'Epic.FormattedID', 'Epic.c_Gaps','Epic.c_ReleasePriority', 'Epic.Name', 'Epic.Release.Name', 
            'Epic.Release.ReleaseStartDate', 'Epic.Release.ReleaseDate', 'Epic.State.Name', 'PlanEstimate', 
            'Epic.c_PreviousEstimate', 'Epic.LeafStoryPlanEstimateTotal', 'Epic.AcceptedLeafStoryPlanEstimateTotal',
            'Epic.LeafStoryCount', 'Epic.UnEstimatedLeafStoryCount', 'Epic.AcceptedLeafStoryCount', 'c_GroomingState',
            'ScheduleState', 'Iteration.Name', 'Iteration.State', 'Ready', 'Project.Name', 'Owner._refObjectName', 'Epic.c_TPO', 
            'Release.Name', 'c_StoryRank', 'FormattedID', 'Name', 'c_ReleasePriority', 'c_KanbanState', 'Parent.Name', 'Blocked', 
            'BlockedReason', 'Epic.Milestones._tagsNameArray[0].Name', 'c_TPO', 'c_Architect'];

	        var theResults = result.Results;
	        //console.log(theResults[0].Epic.Release);
	       	for (var i = 0; i <= theResults.length-1; i++) {
	        	
	        	bigStories.push(theResults[i]);
	        	if (theResults[i].Epic == null) {
	        		bigStories[i].Epic = null;
	        	} else if (theResults[i].Epic.Parent == null){
	        		bigStories[i].Epic.Parent = null;
	        	} else {
	        		bigStories[i].Theme = theResults[i].Epic.Parent;
	        	}
	        
	        }
	        var gotDate = new Date();
	        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	        var gotDate1 = month[gotDate.getMonth()];
	        var gotDate2 = gotDate.getDate();
	        var gotDate3 = gotDate.getFullYear();
	        var gotDate4 = gotDate.getHours();
	        if (gotDate4 < 10) {
	        	gotDate4 = "0" + gotDate4;
	        }
	        var gotDate5 = gotDate.getMinutes();
	        if (gotDate5 < 10) {
	        	gotDate5 = "0" + gotDate5;
	        }
	        var theTimeStamp = gotDate3 + gotDate1 + gotDate2 + "-" +  gotDate4 + gotDate5;

	        console.log(theTimeStamp);  
	        
	        json2csv({data: bigStories, fields: fields}, function(err, csv) {
	        	if (err) console.log(err);
	        	fs.writeFile('StoryDefectReport' + theTimeStamp + '.csv', csv, function(err) {
	        		if(err) throw err;
	        		console.log('file saved!');
	        	})
	        })
	       	
	    }
	});
};

entireQuery();

app.listen(3000, function() {
	console.log('server started');
});
