module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      main: "src/jquery.<%= pkg.name %>.js"
    },
    less: {
      compile: {
        files: {
          "examples/css/styles.css": "less/styles.less"
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> version: <%= pkg.version %>\n*  <%= grunt.template.today("yyyy-mm-dd") %>\n*  Author: Tim Nelson\n*  Website: http://eltimn.github.com/jquery-bs-formalerts\n*  Apache 2.0 License http://www.apache.org/licenses/LICENSE-2.0\n*/\n'
      },
      build: {
        src: 'src/jquery.<%= pkg.name %>.js',
        dest: 'build/jquery.<%= pkg.name %>.min.js'
      }
    },
    watch: {
      main: {
        files: '<%= jshint.main %>',
        tasks: ['jshint']
      },
      less: {
        files: 'src/<%= pkg.name %>.less',
        tasks: ['less:compile']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Tasks
  grunt.registerTask('build', ['jshint', 'uglify', 'less']);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};
