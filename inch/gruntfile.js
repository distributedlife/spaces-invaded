module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'public/javascript/**/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
        force: true
      }
    },

    jasmine_node: {
      forceExit: true,
      extensions: "coffee",
      specNameMatcher: "control_spec"
    },

    notify_hooks: {
      options: {
        enabled: true,
        title: "gamedev"
      }
    },

    watch: {
      src: {
        files: [ 'public/**/*.js', 'spec/**/*.coffee' ],
        tasks: [ 'jasmine_node' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-notify');

  grunt.task.run('notify_hooks');

  grunt.registerTask('default', ['jasmine_node']);
};