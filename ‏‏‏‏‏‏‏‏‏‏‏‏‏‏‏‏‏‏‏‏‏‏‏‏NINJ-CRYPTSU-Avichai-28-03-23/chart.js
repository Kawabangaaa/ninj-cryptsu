fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true')
  .then(response => response.json())
  .then(data => {
  	console.log(data); // display data in the console
  	const labels = data[0].sparkline_in_5min.price.map((_, i) => `#${i+1}`);
  	const datasets = data.map(d => ({
  		label: d.name,
  		data: d.sparkline_in_5min.price,
  		borderColor: getRandomColor(),
  		borderDash: [5, 5],
  		fill: false
  	}));
  	const config = {
  		type: 'line',
  		data: {
  			labels: labels,
  			datasets: datasets
  		},
  		options: {
  			responsive: true,
  			maintainAspectRatio: false,
  			title: {
  				display: true,
  				text: 'Crypto Prices (USD) every 5 min'
  			},
  			tooltips: {
  				mode: 'index',
  				intersect: false
  			},
  			hover: {
  				mode: 'nearest',
  				intersect: true
  			},
  			scales: {
  				xAxes: [{
  					display: true,
  					scaleLabel: {
  						display: true,
  						labelString: 'Time'
  					}
  				}],
  				yAxes: [{
  					display: true,
  					scaleLabel: {
  						display: true,
  						labelString: 'Price (USD)'
  					}
  				}]
  			}
  		}
  	};
  	const ctx = document.getElementById('myChart').getContext('2d');
  	new Chart(ctx, config);
  });

function getRandomColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}