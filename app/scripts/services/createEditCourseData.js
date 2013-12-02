/**
 * Created by kunal on 20/11/13.
 */
angular.module('kinoEduServices')
    .factory('CreateCourseData',function($http){
        var isCourseCreated = false;
        var courseTitle = '';
        var selectedCategory = '';
        var selectedLevel = '';
        var courseSummary = '';
        var courseDetails = '';
        var coursePromoVideo = '';
        var courseAuthor = '';
        var courseTags = [];
        var courseCategoryArr = [
            {value:1,option:"Computer Fundamentals"},
            {value:2,option:"JAVA"},
            {value:3,option:".NET Technologies"},
            {value:4,option:"JavaScript Frameworks and Libraries"},
            {value:5,option:"Networking"}
        ];
        var courseLevelArr = [
            {value:1,option:"Introductory"},
            {value:2,option:"Intermediate"},
            {value:3,option:"Advance"},
            {value:4,option:"All Levels (Comprehensive)"}
        ];
        var sectionDataArr = [
            {
                sectionNumber:1,
                sectionTitle:"",
                topics:[
                    {
                        topicNumber:1,
                        topicTitle:"",
                        topicContent:"",
                        topicVidLink:""
                    }
                ]
            }
        ];
        var addSection = function($event){
            if($event.keyCode == 13){
                $event.preventDefault();
                return;
            }
            var addedSection = {
                sectionNumber:(sectionDataArr.length+1),
                sectionTitle:"",
                topics:[
                    {
                        topicNumber:(this.length+1),
                        topicTitle:"",
                        topicContent:"",
                        topicVidLink:""
                    }
                ]
            };
            sectionDataArr.push(addedSection);
        };

        var addTopic = function($event,sectionId){
            if($event.keyCode == 13){
                $event.preventDefault();
                return;
            }
            var addedTopic = {
                topicNumber:(sectionDataArr[sectionId].topics.length+1),
                topicTitle:"",
                topicContent:"",
                topicVidLink:""
            }

            sectionDataArr[sectionId].topics.push(addedTopic);
        }

        return ({
            isCreated:isCourseCreated,
            courseTitle:courseTitle,
            selectedCategory:selectedCategory,
            courseCategoryArr:courseCategoryArr,
            selectedLevel:selectedLevel,
            courseLevelArr:courseLevelArr,
            courseSummary:courseSummary,
            courseDetails:courseDetails,
            coursePromoVideo:coursePromoVideo,
            courseAuthor:courseAuthor,
            courseTags:courseTags,
            sectionData:sectionDataArr,
            addSection:addSection,
            addTopic:addTopic
        });
    });