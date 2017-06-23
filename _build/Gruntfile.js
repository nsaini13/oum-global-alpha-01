module.exports = function(grunt) {

  // Grunt Plugins
  //---------------------------------------------------------
  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-chokidar');

  // Project Configuration
  //---------------------------------------------------------
  grunt.initConfig({
    // Define
    pkg: grunt.file.readJSON('package.json'),

    rootPath: '../',
    appPath: '<%= rootPath %>' + 'app/',
    sassPath: '<%= appPath %>' + 'sass/',
    cssPath: '<%= appPath %>' + 'css/',
    scriptsPath: '<%= appPath %>' + 'scripts/',
    vendorsPaths: '<%= appPath %>' + 'vendors/',

    // sass
    sass: {
      dev: {
        expand: true,
        cwd: '<%= sassPath %>',
        src: '*.scss',
        dest: '<%= cssPath %>',
        ext: '.css'
      }
    },

    // Bower Copy
    bowercopy: {
      dev: {
        options: {
          destPrefix: '<%= vendorsPaths %>'
        },
        files:  [
          { dest: 'jquery' , src: [ 'jquery/dist/*' ]},
          { dest: 'underscore' , src: [ 'underscore/underscore.js' , 'underscore/underscore-min.js' ]},
          { dest: 'bootstrap' , src: [ 'bootstrap/dist/*' ]}
        ]
      }
    },

    // Injector
    injector: {
      injectDefaultCss: {
        options: {
          starttag: '<!-- injector-default-css -->',
          endtag: '<!-- endinjector-default-css -->',
          transform: function (filePath) {
            filePath = filePath.replace('/' + grunt.config.get('appPath'), '');
            return '<link href="' + filePath + '" rel="stylesheet">';
          },
        },
        files: {
          '<%= appPath %>index.html': ['<%= cssPath %>' + '*.css']
        }
      },
      injectDefaultScripts: {
        options: {
          starttag: '<!-- injector-default-scripts -->',
          endtag: '<!-- endinjector-default-scripts -->',
          transform: function (filePath) {
            filePath = filePath.replace('/' + grunt.config.get('appPath'), '');
            return '<script type="text/javascript" src="' + filePath + '"></script>';
          },
        },
        files: {
          '<%= appPath %>index.html': ['<%= scriptsPath %>' + '*.js']
        }
      }
    },

    // Web Server
    connect: {
      server: {
        options: {
          keepalive: false,
          protocol: 'http',
          hostname: 'localhost',
          base: '<%= appPath %>',
          port: 8282,
          livereload: 35729
        }
      }
    },

    // Watch
    chokidar: {
      options: {
        livereload: 35729
      },
      sass: {
        files: '<%= sassPath %>' + '**/*.scss',
        tasks: ['sass:dev']
      },
      scripts: {
        files: '<%= scriptsPath %>' + '**/*.js',
        tasks: [],
        options: { event: ['change'] }
      },
      scriptsInject: {
        files: '<%= scriptsPath %>' + '**/*.js',
        tasks: ['injector:injectDefaultScripts'],
        options: { event: ['add','unlink'] }
      },
      indexHtml: {
        files: '<%= appPath %>' + 'index.html',
        tasks: []
      }
    }

    // end
  });

  // Grunt Tasks
  //---------------------------------------------------------
  grunt.registerTask('print', function(){
    grunt.log.writeln('this is the default task');
  });

  // Grunt Copy Bower
  //---------------------------------------------------------
  grunt.registerTask('bower-copy', ['bowercopy']);

  // Grunt DEFAULT
  //---------------------------------------------------------
  grunt.registerTask('default2', ['injector']);

  grunt.registerTask('default', [
    'bowercopy',
    'injector',
    'connect:server',
    'chokidar'
  ]);

}
