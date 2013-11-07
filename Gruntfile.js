module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-connect-proxy');

  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

  grunt.initConfig({
    shell: {
      options: {
        stdout: true
      },
      gumby_fonts: {
        command: 'cp -R bower_components/gumby/fonts app/'
      },
      selenium: {
        command: './selenium/start',
        options: {
          stdout: false,
          async: true
        }
      },
      protractor_install: {
        command: 'node ./node_modules/protractor/bin/install_selenium_standalone'
      },
      npm_install: {
        command: 'npm install'
      },
      bower_install: {
        command: 'node ./node_modules/bower/bin/bower install'
      },
    },

    connect: {
      options: {
        base: 'app/',
        middleware: function (connect, options) {
          return [
            connect.static(options.base),
            proxySnippet
          ];
        }
      },
      proxies: [{
          context: '/api',
          host: 'localhost',
          port: 3000,
          rewrite: {
            '/api(.+)': '/api/$1'
          }
        },{
          context: '/storage',
          host: 'localhost',
          port: 6666,
          rewrite: {
            '/storage(.+)': '/$1'
          }
        }
      ],
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: 8888
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    protractor: {
      options: {
        keepAlive: false,
        configFile: "./test/protractor.conf.js"
      },
      singlerun: {},
      auto: {
        keepAlive: true,
        options: {
          args: {
            seleniumPort: 4444
          }
        }
      }
    },

    concat: {
      styles: {
        dest: './app/assets/app.css',
        src: [
          'bower_components/gumby/css/gumby.css',
          'app/styles/animations.css',
          'app/styles/app.css'
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './app/assets/app.js',
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/pusher/dist/pusher.js',
          'app/scripts/config.js',
          'app/scripts/pusher.js',
          'app/scripts/channels.js',
          'app/scripts/utils.js',
          'app/scripts/homePages.js',
          'app/scripts/profilePages.js',
          'app/scripts/commentPages.js',
          'app/scripts/app.js'
        ]
      }
    },

    watch: {
      options : {
        livereload: 7777
      },
      assets: {
        files: ['app/styles/**/*.css','app/scripts/**/*.js'],
        tasks: ['concat']
      },
      protractor: {
        files: ['app/scripts/**/*.js','test/e2e/**/*.js'],
        tasks: ['protractor:auto']
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/scripts/*.js': ['coverage']
        },
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      },
    }
  });

  //single run tests
  grunt.registerTask('test', ['test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

  //autotest and watch tests
  grunt.registerTask('autotest', ['karma:unit_auto']);
  grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  grunt.registerTask('autotest:e2e', ['connect:testserver','shell:selenium','watch:protractor']);

  //coverage testing
  grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);

  //installation-related
  grunt.registerTask('install', ['update','shell:protractor_install']);
  grunt.registerTask('update', ['shell:npm_install','shell:bower_install', 'shell:gumby_fonts', 'concat']);

  //defaults
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['update', 'configureProxies', 'connect:devserver', 'open:devserver', 'watch:assets']);

  //server daemon
  grunt.registerTask('serve', ['connect:webserver']);
};
