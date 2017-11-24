// lazyload config

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   ['vendor/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],   //导航扇形图
      footable:       ['vendor/jquery/footable/footable.all.min.js',
                          'vendor/jquery/footable/footable.core.css'],
      },
  )
  