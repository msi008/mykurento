module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);

    require('time-grunt')(grunt);
    var option = {
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            options: {
                paths: ['']
            },
            all: {
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: ['**/*'],
                    dest: 'dist/assets',
                    flatten: false
                }, {
                    expand: true,
                    cwd: 'app',
                    src: ['**/*'],
                    dest: 'dist/app',
                    flatten: false
                }, {
                    expand: true,
                    cwd: 'bin',
                    src: ['**/*'],
                    dest: 'dist/bin',
                    flatten: false
                },{
                    expand: true,
                    cwd: 'fake-keys',
                    src: ['**/*'],
                    dest: 'dist/fake-keys',
                    flatten: false
                },{
                    expand: true,
                    cwd: '',
                    src: ['README.md'],
                    dest: 'dist/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['Gruntfile.js'],
                    dest: 'dist/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['package.json'],
                    dest: 'dist/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['log.js'],
                    dest: 'dist/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['server.js'],
                    dest: 'dist/',
                    flatten: false
                }
                ]
            },
            tar :{
                files : [{
                    expand:true,
                    src:['*.tgz'],
                    dest:'deploy'
                }]
            }
        },
        replace: {
            prod: {
                options: {
                    patterns: [
                        {
                            match: /, 'development'/ig,
                            replacement: ", 'production'"
                        },
                        {
                            match: /, 'devdateext'/ig,
                            replacement: ", '"+grunt.template.today('yyyymmddHH')+"'"
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['index.php'], dest: 'dist/'},
                    {expand: true, flatten: true, src: ['.htaccess'], dest: 'dist/'}
                ]
            },
            development: {
                options: {
                    patterns: [
                        {
                            match: /, 'development'/ig,
                            replacement:  ", 'development'"
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['index.php'], dest: 'dist/'},
                    {expand: true, flatten: true, src: ['.htaccess'], dest: 'dist/'}
                ]
            },
            test: {
                options: {
                    patterns: [
                        {
                            match: /, 'development'/ig,
                            replacement: ", 'testing'"
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['index.php'], dest: 'dist/'},
                    {expand: true, flatten: true, src: ['.htaccess'], dest: 'dist/'}
                ]
            }
        },
        clean: {
            dist: ['dist'], //清除dist目录
            build: ['.build'], //清除build目录
            deploy:['deploy'], //清除deploy目录
            tar: ['*.tgz'] //清除tar包
        },
        less: {
            /**
             * [build 编译所有的less文件，按照模板分类]
             */
            build: {
                files: {}
            }
        },

        /** css压缩 */
        cssmin: {
            options: {
                keepSpecialComments: 0,
                compatibility: 'ie8',
                noAdvanced: true
            },
            minify: {
                expand: true,
                cwd: 'dist/',
                src: ['assets/css/*.css'],
                dest: 'dist/',
                ext: '.css'
            },
            compress: {
                files: {
                    'dist/assets/css/kurento-min.css': ["dist/assets/css/kurento.css","dist/assets/css/login.css","dist/assets/css/widget-base.css"]
                }
            }
        },

        /** 图片压缩*/
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3// 图片优化水平，3是默认值，取值区间0-7
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['assets/img/*.{png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        },
        jshint: {
            options: {
                trailing: true,
                sub: true
            },
            files: ['']
        },
        transport: {
            options: {
                paths: ['.'],
                alias: '<%= pkg.spm.alias %>',
                parsers: {
                    '.js': [script.jsParser],
                    '.css': [style.css2jsParser],
                    '.html': [text.html2jsParser]
                }
            },
            all: {
                options: {
                    idleading: ""
                },
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['./assets/whiteboard/*.js'],
                    filter: 'isFile',
                    dest: '.build'
                }]
            }
        },
        concat: {
            options: {
                //paths: ['.'],
                //include: 'relative'
                separator: ';',
                stripBanners: true
            },
            modules: {
                files: [{
                    expand: true,
                    cwd: '.build/',
                    src: ['assets/whiteboard/*.js'],
                    dest: 'dist/assets/whiteboard/draw-min.js',
                    ext: '.js'
                }]
            },
            dist: {
                src: ['assets/whiteboard/*.js'],
                dest: 'dist/assets/whiteboard/draw-min.js'
            }
        },
        uglify: {
            /**
             * [seajs 合并Seajs扩展文件，并混淆压缩]
             */
            seajs: {
                files: {
                    //"assets/js/lib/core/sea.js": ["assets/js/lib/core/sea.js"]
                }
            },
            /**
             * [all 混淆压缩所以的页面模块文件]
             */
            all: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['assets/whiteboard/*.js'],
                    dest: 'dist/',
                    ext: '.js'
                }]
            }

            //bulid: {
            //    src: "dist/assets/js/application.js",
            //    dest: "dist/assets/js/app.min.js"
            //}
        },

        /** 打zip,tar包 */
        compress: {
            test: {
                options: {
                    archive: '<%= pkg.name %>_<%= pkg.version %>_<%= grunt.template.today("yyyymmdd") %>_testing.tgz'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: '/'
            },
            prod: {
                options: {
                    archive: '<%= pkg.name %>_<%= pkg.version %>_<%= grunt.template.today("yyyymmdd") %>_production.tgz'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: '/'
            }
        },

        /**
         * [template 编译html 模板引擎handlebars]
         */
        template: {
            dev: {
                engine: 'handlebars',
                cwd: 'src/templates/',
                partials: ['src/templates/fixtures/*.hbs'],
                data: 'src/templates/data.json',
                options: {},
                files: [{
                    expand: true,
                    cwd: 'src/templates/',
                    src: ['*.hbs'],
                    dest: 'dist/templates',
                    ext: '.html'
                }]
            }
        }
    }

    //var mode_env = "development"; //线上环境prod, 测试环境testing

    var task_dev = [];
    task_dev.push("clean:build");
    task_dev.push("clean:dist");
    //task_dev.push("transport:all");
    // task_dev.push("transport:single");
    task_dev.push("copy:all");
    task_dev.push("concat:dist");
    task_dev.push("uglify:all");
    //task_dev.push("clean:build");
    //task_dev.push("replace:development");
    //task_dev.push("template");


    var task_test = [];
    task_test.push("clean:build");
    task_test.push("clean:dist");
    task_test.push("clean:deploy");
    task_test.push("copy:all");
    //task_test.push("transport:all");
    task_test.push("concat:dist");
    task_test.push("uglify:all");
    task_test.push("cssmin:compress");
    //task_test.push("imagemin");
    //task_test.push("replace:test");

    task_test.push("compress:test");
    task_test.push("copy:tar");
    task_test.push("clean:tar");

    var task_prod = [];
    task_prod.push("clean:build");
    task_prod.push("clean:dist");
    task_prod.push("clean:deploy");
    task_prod.push("copy:all");
    //task_prod.push("transport:all");
    task_prod.push("concat:dist");
    task_prod.push("uglify:all");
    task_prod.push("cssmin:compress");
    //task_prod.push("imagemin");
    //task_prod.push("replace:prod");

    task_prod.push("compress:prod");
    task_prod.push("copy:tar");
    task_prod.push("clean:tar");

    grunt.initConfig(option);

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-template-html');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks("grunt-contrib-compress");

    //grunt.registerTask('check', ['jshint']);
    //grunt.registerTask('css', ['less:build', 'cssmin:build','copy:all']);
    //grunt.registerTask('css', ['cssmin']);
    //grunt.registerTask('seajs', ['uglify:seajs']);
    //grunt.registerTask('tpl', ['template',"copy:all"]);
    //grunt.registerTask('cp', ['copy:all']);
    grunt.registerTask('dev', task_dev);
    grunt.registerTask('test', task_test);
    grunt.registerTask('prod', task_prod);

    grunt.registerTask('jstest', ['jshint']);
};
