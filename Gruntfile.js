'use strict';
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-connect-proxy');

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    //require('grunt-connect-proxy')(grunt);


    grunt.initConfig({
        kinoedu: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'dist'
        },
        watch: {
            styles: {
                files: ['<%= kinoedu.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= kinoedu.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= kinoedu.app %>}/scripts/{,*/}*.js',
                    '<%= kinoedu.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        autoprefixer: {
            options: ['last 1 version'],
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        connect: {
            options: {
                port: 8080,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            proxies: [
                {
                    context: '/api',
                    host: 'localhost',
                    port: 3000,
                    https: false,
                    changeOrigin: true,
                    xforward: false,
                    rewrite: {
                        '/api/': '/'
                    }
                }
            ],
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= kinoedu.app %>'
                    ],
                    /*middleware: function (connect) {
                        return [
                            proxySnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }*/
                    middleware: function (connect, options) {
                        var middlewares = [];
                        options.base.forEach(function(base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });
                        middlewares.push(proxySnippet);
                        return middlewares;
                    }
                }
            },
            test: {
                options: {
                    port: 8081,
                    base: [
                        '.tmp',
                        'test',
                        '<%= kinoedu.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= kinoedu.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= kinoedu.dist %>/*',
                        '!<%= kinoedu.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= kinoedu.app %>/scripts/{,*/}*.js'
            ]
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
         dist: {}
         },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= kinoedu.dist %>/scripts/{,*/}*.js',
                        '<%= kinoedu.dist %>/styles/{,*/}*.css',
                        '<%= kinoedu.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= kinoedu.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= kinoedu.app %>/index.html',
            options: {
                dest: '<%= kinoedu.dist %>'
            }
        },
        usemin: {
            html: ['<%= kinoedu.dist %>/{,*/}*.html'],
            css: ['<%= kinoedu.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= kinoedu.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= kinoedu.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= kinoedu.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= kinoedu.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= kinoedu.dist %>/images'
                }]
            }
        },
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            // dist: {
            //   files: {
            //     '<%= kinoedu.dist %>/styles/main.css': [
            //       '.tmp/styles/{,*/}*.css',
            //       '<%= kinoedu.app %>/styles/{,*/}*.css'
            //     ]
            //   }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= kinoedu.app %>',
                    src: ['*.html', 'views/*.html'],
                    dest: '<%= kinoedu.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= kinoedu.app %>',
                    dest: '<%= kinoedu.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'bower_components/**/*',
                        'images/{,*/}*.{gif,webp}',
                        'styles/fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= kinoedu.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= kinoedu.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= kinoedu.dist %>/scripts',
                    src: '*.js',
                    dest: '<%= kinoedu.dist %>/scripts'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= kinoedu.dist %>/scripts/scripts.js': [
                        '<%= kinoedu.dist %>/scripts/scripts.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'configureProxies',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'copy:dist',
        'ngmin',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'configureProxies'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
