let reportsArray = [];

$('a[href="#about"]').on('click', function(event) {
  event.preventDefault();
  $('#about-container').show();
  $('#crypto-container').hide();
  $('.chartCard').hide();
});

function searchCoin(event) {
  event.preventDefault();
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.trim().toLowerCase();
  const apiUrl = `https://api.coingecko.com/api/v3/coins/list?include_platform=false`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("working");
      const coins = data.filter(item => item.name.toLowerCase().includes(searchTerm) || item.symbol.toLowerCase().includes(searchTerm));
      if (coins.length > 0) {
        const cards = coins.map(coin => {
          const coinUrl = `https://api.coingecko.com/api/v3/coins/${coin.id}`;
          return fetch(coinUrl)
            .then(response => response.json())
            .then(data => {
              return `
                <div class="card">
                  <img class="logo" src="${data.image.small}" alt="${data.name} logo">
                  <div class="name">${data.name}</div>
                  <div class="price">Price (USD): $${data.market_data.current_price.usd.toFixed(2)}</div>
                  <div class="price">Price (Euro): €${data.market_data.current_price.eur.toFixed(2)}</div>
                  <div class="price">Price (ILS): ₪${(data.market_data.current_price.usd * 3.29).toFixed(2)}</div>
                  <br>
          <button id="moreInfoButton" class="btn btn-outline-dark" type="button" data-toggle="collapse" data-target="#collapse-${crypto.id}">More info</button>
          <div id="moreInfo" class="hide">
          <br>
          <p class="high-24h">High (24h): $${data.market_data.high_24h.usd.toFixed(2)}</p>
          <p class="low-24h">Low (24h): $${data.market_data.low_24h.usd.toFixed(2)}</p>
          <p class="total-volume">Total Volume (24h): $${data.market_data.total_volume.usd.toFixed(2)}</p>
        </div>
                     </div>
              `;
            })
            .catch(error => console.error(error));
        });
        Promise.all(cards)
          .then(results => {
            const cryptoContainer = document.getElementById('crypto-container');
            cryptoContainer.innerHTML = results.join('');
            $('.more-info-button').on('click', function(event) {
              event.preventDefault();
              $(this).siblings('#moreInfo').toggleClass('hide');
            });
          })
          .catch(error => console.error(error));
      } else {
        const cryptoContainer = document.getElementById('crypto-container');
        cryptoContainer.innerHTML = '<p>No results found.</p>';
      }
    })
    .catch(error => console.error(error));
}

const searchForm = document.getElementById('search');
searchForm.addEventListener('submit', searchCoin);

const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true&price_change_percentage=24h';
$('#liveReports').click(function() {
  $('#about-container').hide();
  $('#crypto-container').show();
  $('.chartCard').show();
 
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("working");
      data.forEach(crypto => {
        const card = `
          <div class="card">
            <img class="logo" src="${crypto.image}" alt="${crypto.name} logo">
          <div class="name">${crypto.name}</div>
          <div class="price">Price (USD): $${crypto.current_price.toFixed(2)}</div>
          <div class="price">Price (Euro): €${(crypto.current_price / 1.18).toFixed(2)}</div>
          <div class="price">Price (ILS): ₪${(crypto.current_price * 3.29).toFixed(2)}</div>
        </div>
      `;
      document.getElementById('crypto-container').innerHTML += card;
    });
    createMainChart(data);
  })
  .catch(error => {
    console.error(error);
  });

// connect to the canvas in our HTML and add a chart from chartJS.
function createMainChart(data) {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Transform data into chart format
  const labels = Array.from(Array(24).keys()); // generate labels for the last 24 hours
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  const topFive = data.slice(0, 5); // get the top 5 coins
  const datasets = topFive.map((crypto, i) => {
    const prices = crypto.sparkline_in_7d.price.slice(-24); // get the last 24 hours of prices
    return {
      label: crypto.name,
      data: prices,
      borderColor: colors[i],
      borderWidth: 1,
      borderDash: [5, 5],
    };
  });

  // Create chart
  const config = {
    type: 'line',
    data: { labels, datasets },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (hours ago)',
          },
          ticks: {
            reverse: true,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)',
          },
          beginAtZero: true,
        },
      },
    },
  };

  const myChart = new Chart(ctx, config);
}
})

$('#getCoins').click(function() {
  location.reload();
})

$('#getCoins').click(function getCoins() {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log("working");
    // Loop through the data and add cards to the page
    data.forEach(crypto => {
      const card = `
        <div class="card">
          <img class="logo" src="${crypto.image}" alt="${crypto.name} logo">
          <div class="name">${crypto.name}</div>
          <div class="price">Price (USD): $${crypto.current_price.toFixed(2)}</div>
          <div class="price">Price (Euro): €${(crypto.current_price / 1.18).toFixed(2)}</div>
          <div class="price">Price (ILS): ₪${(crypto.current_price * 3.29).toFixed(2)}</div>
        </div>
      `;
      document.getElementById('crypto-container').innerHTML += card;
    });
  })
  .catch(error => {
    console.error(error);
  });
})



function getCoins() {

  $('#about-container').hide();
  $('#crypto-container').show();
  $('.chartCard').hide();
 
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Loop through the data and add cards to the page
    data.forEach(crypto => {
      const card = `
        <div class="card">
          <img class="logo" src="${crypto.image}" alt="${crypto.name} logo">
          <div class="name">${crypto.name}</div>
          <div class="price">Price (USD): $${crypto.current_price.toFixed(2)}</div>
          <div class="price">Price (Euro): €${(crypto.current_price / 1.18).toFixed(2)}</div>
          <div class="price">Price (ILS): ₪${(crypto.current_price * 3.29).toFixed(2)}</div>
          <br>
          <button id="moreInfoButton" class="btn btn-outline-dark" type="button" data-toggle="collapse" data-target="#collapse-${crypto.id}">More info</button>
          <div id="moreInfo" class="hide">
          <br>
          <p class="high-24h">High (24h): $${crypto.high_24h.toFixed(2)}</p>
          <p class="low-24h">Low (24h): $${crypto.low_24h.toFixed(2)}</p>
          <p class="total-volume">Total Volume (24h): $${crypto.total_volume.toFixed(2)}</p>
        </div>
</div>
      `;
      document.getElementById('crypto-container').innerHTML += card;

    });
  })


  
  .catch(error => {
    console.error(error);
  });
  
  $('#crypto-container').on('click', '#moreInfoButton', function(event) {
    event.preventDefault();
    $(this).siblings('#moreInfo').toggleClass('hide');
  });


}




getCoins ();
