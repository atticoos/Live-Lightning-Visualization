angular.module('lightningApp').directive('lightningMap', function ($window, $rootScope, LightningSocket) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope, element) {
      var width = 690,
          height = 700,
          projection, svg, path, g, zoom,
          strikes, strike, strikeAdd;

      scope.socketData = LightningSocket.data;

      projection = d3.geo.mercator()
        .center([0, 60])
        .scale(300)
        .rotate([80, 0]);

      svg = d3.select(element[0]).append('svg')
        .attr('width', width)
        .attr('height', height);

      path = d3.geo.path()
        .projection(projection);

      g = svg.append('g');

      d3.json('/world.json', function (error, topology) {
        g.selectAll('path')
          .data(topojson.object(topology, topology.objects.countries).geometries)
          .enter()
          .append('path')
          .attr('d', path);
      });

      strikes = [];
      var refreshMap = function () {
        if (strikes.length == 0) return;

        var groups = g.selectAll('g')
          .data(strikes)
          .enter()
          .append('g');

        groups.append('circle')
          .attr('cx', function (d) {
            return projection([d.lon, d.lat])[0];
          })
          .attr('cy', function (d) {
            return projection([d.lon, d.lat])[1];
          })
          .attr('fill', 'red')
          .attr('r', 5);

        groups.append('circle')
          .attr('fill', 'transparent')
          .attr('cx', function (d) {
            return projection([d.lon, d.lat])[0];
          })
          .attr('cy', function (d) {
            return projection([d.lon, d.lat])[1];
          })
          .attr('r', 6)
          .attr('stroke', 'yellow')
          .attr('stroke-width', 0.50)
          .transition()
          .duration(2000)
          .attr('r', 40)
          .transition()
          .attr('stroke', 'transparent');
      };

      $rootScope.$watch(function () {
        return LightningSocket.data
      }, function () {
        strikes = LightningSocket.data;
        refreshMap();
        console.log("new data", LightningSocket.data);
      }, true);

    }
  }
});
