d3.contextMenu = function (menu, objet ,openCallback) {
	// create the div element that will hold the context menu
	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu');

	// close menu
	d3.select('body').on('click.d3-context-menu', function() {
		d3.select('.d3-context-menu').style('display', 'none');
	});

	// this gets executed when a contextmenu event occurs
	return function(data, index) {
		var elm = this;
		d3.selectAll('.d3-context-menu').html('');
		var list = d3.selectAll('.d3-context-menu').append('ul');
		list.selectAll('li').data(menu).enter()
			.append('li')
			.html(function(d) {return d.title;})
			.append('input')
            .attr('type','range')
            .attr('min','0')
            .attr('max','200')
            .attr('id',function(d) {return d.idRange;})
			.on('input', function(d, i, elm) {resize(d, i, elm, objet, this.value);});
		//list.append("li").append("span").html("Supprimer").on("click", function(){objet.remove(); d3.select('.d3-context-menu').style('display', 'none');} );
			

		// the openCallback allows an action to fire before the menu is displayed
		// an example usage would be closing a tooltip
		if (openCallback) openCallback(data, index);

		// display context menu
		d3.select('.d3-context-menu')
			.style('left', (d3.event.pageX - 2) + 'px')
			.style('top', (d3.event.pageY - 2) + 'px')
			.style('display', 'block');

		d3.event.preventDefault();
	};
};