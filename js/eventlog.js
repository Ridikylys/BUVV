$('.diagnostics-legend').click(function(event) {
	$('.diagnostics-legend-arrows').toggleClass('diagnostics-legend-arrows-up');
	$('.diagnostics-legend-arrowsDown').toggleClass('diagnostics-legend-arrowsDown-visible');
	$('.filter-block-teh').toggleClass('displaynone2');
	$('.eventlog-filter').toggleClass('displaynone');
});