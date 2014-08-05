angular.module('lightningApp').directive('lightningMap', function ($window, WebSocket) {
  return {
    restrict: 'E',
    scope: {
    },
    link: function (scope, element) {
      var socket = WebSocket(),
          width = angular.element($window).width(),
          height = 700,
          projection, svg, path, g, zoom,
          strikes, strike, strikeAdd;
socket.send(JSON.stringify({"region":'1',"west":'-130.0',"east":'-60',"north":'62.5',"south":'2.3'}));
      projection = d3.geo.mercator()
        .center([0, 40])
        .scale(200)
        .rotate([30, 0]);

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

      zoom = d3.behavior.zoom()
        .on('zoom', function () {
          g.attr('transform', 'translate(' +
            d3.event.translate.join(',') +
            ')scale(' +
            d3.event.scale +')');
          g.selectAll('circle')
            .attr('d', path.projection(projection));
          g.selectAll('path')
            .attr('d', path.projection(projection));
        });
      svg.call(zoom);


      strikes = [];
      var strikeAdd = function (strike) {
        scope.total++;
        strikes.push(strike);
        g.selectAll('circle')
          .data(strikes)
          .enter()
          .append('circle')
          .attr('cx', function (d) {
            return projection([d.lon, d.lat])[0];
          })
          .attr('cy', function (d) {
            return projection([d.lon, d.lat])[1];
          })
          .attr('r', 5)
          .attr('fill', 'red');
          scope.$apply(); // dangerous, should handle this differently

      };


      socket.onMessage = function (msg) {
        strikeAdd(msg)
        scope.$apply();
      }

    }
  }
});
