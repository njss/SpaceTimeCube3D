Rickshaw.namespace('Rickshaw.Graph.Renderer.ScatterPlot');

Rickshaw.Graph.Renderer.ScatterPlot = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'scatterplot',

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			unstack: true,
			fill: true,
			stroke: false,
			padding:{ top: 0.1, right: 0.05, bottom: 0.1, left: 0.02 },
			dotSize: 10
		} );
	},

	initialize: function($super, args) {
		$super(args);
	},

	render: function() {

		var graph = this.graph;

		graph.vis.selectAll('*').remove();
		

		graph.series.forEach( function(series) {

			if (series.disabled) return;

			var nodes = graph.vis.selectAll("path")
				.data(series.stack.filter( function(d) { return d.y !== null } ))
				.enter().append("svg:circle")
				.attr("cx", function(d) { return graph.x(d.x) + 12 })
				.attr("cy", function(d) { return graph.y(d.y) -12 })
				.attr("r", function(d) { return ("r" in d) ? d.r : graph.renderer.dotSize});

			Array.prototype.forEach.call(nodes[0], function(n) {
				n.setAttribute('fill', series.color);
			} );

		}, this );
	}
} );
