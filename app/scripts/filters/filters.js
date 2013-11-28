/**
 * Created by kunal on 22/10/13.
 * Filters for the application will reside here
 */

angular.module('kinoEduFilters')
    .filter('isGenre', function() {
        return function(input, genre) {
            if (typeof genre == 'undefined' || genre == null) {
                return input;
            } else {
                var out = [];
                for (var a = 0; a < input.length; a++){
                    for (var b = 0; b < input[a].show.genres.length; b++){
                        if(input[a].show.genres[b] == genre) {
                            out.push(input[a]);
                        }
                    }
                }
                return out;
            }
        };
    });
