module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
        'app/bower_components/jquery/dist/jquery.js', 
        'app/bower_components/bootstrap/dist/js/bootstrap.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-ui-router/release/angular-ui-router.js',
        'app/bower_components/angular-cookies/angular-cookies.js',
        'app/*.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    ngtemplates:  {
      myApp:        {
        src:      'app/**.html',
        dest:     'app/templates.js'
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'app/*.js', 'app/*.html', 'app/json/*.json'],
      tasks: ['ngtemplates', 'concat', 'uglify', 'copy:main', 'copy:toWordPress']
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, flatten: true, src: ['app/index.html', 'app/bower_components/bootstrap/dist/css/bootstrap.min.css', 'app/app.css'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/json/*.*'], dest: 'dist/json/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/bower_components/bootstrap/dist/fonts/*.*'], dest: 'dist/fonts/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['app/bower_components/bootstrap/dist/css/bootstrap.min.css'], dest: 'dist/css/', filter: 'isFile'}
        ],
      },
      toWordPress: {
        files: [
          // includes files within path
          {expand: true, flatten: false, src: ['dist/**'], dest: '/Applications/MAMP/htdocs/wordpress/orderForm/', filter: 'isFile'}
        ],
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['ngtemplates', 'concat', 'uglify', 'copy:main', 'copy:toWordPress']);

};