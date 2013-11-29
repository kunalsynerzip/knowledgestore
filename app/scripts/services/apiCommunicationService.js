/**
 * Created by kunal on 27/11/13.
 */
angular.module('kinoEduServices')
    .factory('ApiCommunicationService',function($http){
        return{
            postData:function(url,dataObj){
                if(dataObj){
                    console.log('Post with PARAMETER!!!')
                    return $http.post(url,dataObj);
                } else {
                    console.log('Post without PARAMETER!!!')
                    return $http.post(url);
                }
            },
            getData:function(url,objId){
                if(objId){
                    return $http.get(url+'/'+objId);
                } else {
                    return $http.get(url);
                }
            },
            updateData:function(url,objId){
                if(objId){
                    return $http.put(url+'/'+objId);
                } else {
                    //return $http.get(url);
                }
            },
            deleteData:function(url,objId){
                if(objId){
                    return $http.delete(url+'/'+objId);
                } else {
                    //return $http.get(url);
                }
            }

        }
    });
