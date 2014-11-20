module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          "build/output.min.js": ['tanya/**/*.js', 'max1/**/*.js', 'max2/**/*.js', '!library/vendor/**/*.js', '!node_modules/**/*.js', '!build/**/*.js', '!gulpfile.js']
        }
      }
    },
    checkDependencies: {
      options: {
        this: {
          options: {
            packageManager: 'bower',
            install: true,
            scopeList: ['dependencies', 'devDependencies'],
            verbose: true
          }
        }
      }
    },
    bower: {
      dev: {
        dest: 'library/vendor'
      }
    },
    bowerInstall: {
      install: {
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['**/*.scss', '!library/vendor/**/*.scss', '!node_modules/**/*.scss'],
          dest: 'build/css',
          ext: '.css'
        }]
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['**/*.less', '!library/vendor/**/*.less', '!node_modules/**/*.less'],
          dest: 'build/css',
          ext: '.css'
        }]
      }
    },
    jsdoc : {
      dist : {
        src: ['tanya/**/*.js', 'max1/**/*.js', 'max2/**/*.js'],
        dest: 'build/jsdoc'
      }
    },
    watch: {
      css: {
        files: ['**/*.scss', '!library/vendor/**/*.scss', '!node_modules/**/*.scss',
          '**/*.less', '!library/vendor/**/*.less', '!node_modules/**/*.less'],
        tasks: ['sass', 'less'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: ['tanya/**/*.js', 'max1/**/*.js', 'max2/**/*.js'],
        tasks: ['uglify'],
        options: {
          interrupt: false
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-install-dependencies');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.renameTask("bower", "bowerInstall");
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-check-dependencies');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('build', ['sass', 'less', 'uglify', 'jsdoc']);

  grunt.registerTask('default', ['install-dependencies', 'bowerInstall', 'bower', 'checkDependencies', "watch", 'build']);

};
