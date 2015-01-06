module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            // You get to make the name
            // The paths tell JSHint which files to validate
            files: ['**/*.js']
        },
        watch: {
            src: {
                files: ['**/*.js','*.js', 'views/*.ejs'],
                options: { livereload: true }
            }
        }
    });
    // Each plugin must be loaded following this pattern
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['jshint']);
};