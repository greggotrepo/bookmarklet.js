javascript:(function(){
    // Create a script element to load Bootstrap CSS
    var bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCSS);

    // Create a script element to load Highcharts
    var highchartsScript = document.createElement('script');
    highchartsScript.src = 'https://code.highcharts.com/stock/highstock.js';
    document.head.appendChild(highchartsScript);

    // Wait for Highcharts to load
    highchartsScript.onload = function() {
        // Create a container for the overlay
        var overlay = document.createElement('div');
        overlay.id = 'fasttrack-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '10000';
        overlay.style.overflowY = 'auto';
        overlay.style.padding = '20px';

        // Create the overlay content
        overlay.innerHTML = `
            <div class="container-fluid bg-dark p-4">
                <div class="row">
                    <div class="col-6">
                        <h1 class="text-light">Enhanced FastTrack Market Data API Tool</h1>
                    </div>
                    <div class="col-6 d-flex justify-content-between gap-1">
                        <div class="form-floating">
                            <input class="form-control form-control-sm" id="txtaccount" type="text" placeholder="account number" value="" />
                            <label for="txtaccount">Account</label>
                        </div>
                        <div class="form-floating">
                            <input class="form-control form-control-sm" id="txtpassword" type="password" placeholder="password" value="" />
                            <label for="txtpassword">Password</label>
                        </div>
                        <div class="form-floating ">
                            <input class="form-control form-control-sm" id="txtappid" type="text" placeholder="appid" value="" />
                            <label for="txtappid">App ID</label>
                        </div>
                        <button class="btn btn-secondary d-flex align-items-center gap-2" onclick="login()">
                            Login
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5.5 0 0 1 .5.5v9a.5.5.5 0 0 1-.5.5h-8a.5.5.5 0 0 1-.5-.5v-2a.5.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5.5 0 0 0 1 0v-2z" />
                                <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="container-fluid my-4">
                <div class="row mb-5">
                    <div class="col-12 d-flex mb-2 gap-2 justify-content-center">
                        <div class="form-floating w-50">
                            <input class="form-control text-uppercase" id="txtticker" type="text" placeholder="Ticker" value="" />
                            <label for="txtticker">Ticker Symbol</label>
                        </div>
                        <button class="btn btn-primary" onclick="getreport()">Get Report</button>
                    </div>
                </div>
                <div class="row mb-2 d-none" id="loading">
                    <div class="col-12">
                        <p id="status"></p>
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-7"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-6"></span>
                            <span class="placeholder col-8"></span>
                        </p>
                    </div>
                </div>
                <div class="row mb-4 d-none" id="report">
                    <hr />
                    <div class="col-12 mb-4 d-flex gap-2">
                        <div class="lead fw-bold" id="top_ticker"></div>
                        <div class="lead" id="top_name"></div>
                    </div>
                    <div class="col-12 mb-4 d-flex gap-2">
                        <div class="lead" id="top_price"></div>
                        <div class="lead" id="top_oneday"></div>
                    </div>
                    <div class="col-12 mb-4">
                        <div id="chart_line"></div>
                    </div>
                    <div class="col-12 mb-4">
                        <h2>Expanded Returns Table</h2>
                        <table class="table" id="table_returns"></table>
                    </div>
                    <div class="col-12 mb-4">
                        <h2>Returns by Year Table</h2>
                        <table class="table" id="table_years"></table>
                    </div>
                    <div class="col-12 mb-4">
                        <h2>Top 10 Holdings Table</h2>
                        <table class="table" id="table_top10"></table>
                    </div>
                    <div class="col-12 mb-4">
                        <h2>Sector Allocation Table</h2>
                        <table class="table" id="table_sector"></table>
                    </div>
                </div>
            </div>
            <button class="btn btn-danger position-absolute" style="top: 20px; right: 20px;" onclick="document.getElementById('fasttrack-overlay').remove();">Close</button>
        `;

        document.body.appendChild(overlay);

        async function getreport() {
            let ticker = document.getElementById("txtticker").value.trim().toUpperCase();
            let token = sessionStorage.getItem('fasttrack_token');
            let appid = sessionStorage.getItem('fasttrack_appid');

            if (!token || !appid) {
                document.getElementById("status").innerHTML = "Please log in first.";
                return;
            }

            document.getElementById("loading").classList.remove("d-none");
            document.getElementById("status").innerHTML = "Loading data...";
            document.getElementById("report").classList.add("d-none");

            try {
                await get_returns(token, appid, ticker);
                await get_portfolio(token, appid, ticker);
                await get_chart(token, appid, ticker);
            } catch (error) {
                document.getElementById("status").innerHTML = "Error fetching data: " + error.message;
            }

            document.getElementById("loading").classList.add("d-none");
            document.getElementById("report").classList.remove("d-none");
        }

        async function get_returns(token, appid, ticker) {
            try {
                var response = await fetch(`https://ftl.fasttrack.net/v1/stats/${ticker}`, {
                    headers: {
                        token: token,
                        appid: appid
                    }
                });
                var stats = await response.json();

                if (stats.err) {
                    throw new Error(stats.err.message);
                }

                var return_columns = ["onemonth", "threemonths", "one", "three", "five", "ten"];
                var returns_html = "<thead><tr>";
                return_columns.forEach(col => {
                    returns_html += `<th>${col}</th>`;
                });
                returns_html += "</tr></thead><tr>";
                return_columns.forEach(col => {
                    returns_html += `<td>${stats.returns.total[col]}</td>`;
                });
                returns_html += "</tr>";

                document.getElementById("table_returns").innerHTML = returns_html;

                var years_columns = ["year", "total"];
                var years_html = "<thead><tr>";
                years_columns.forEach(col => {
                    years_html += `<th>${col}</th>`;
                });
                years_html += "</tr></thead>";
                stats.returns.byyear.forEach(stat => {
                    years_html += "<tr>";
                    years_columns.forEach(col => {
                        years_html += `<td>${stat[col]}</td>`;
                    });
                    years_html += "</tr>";
                });

                document.getElementById("table_years").innerHTML = years_html;

                document.getElementById("top_ticker").innerHTML = ticker;
                document.getElementById("top_name").innerHTML = stats.describe.name;
                document.getElementById("top_price").innerHTML = "Price: " + stats.describe.price;
                document.getElementById("top_oneday").innerHTML = "1-Day Return: " + stats.returns.total.oneday;
            } catch (error) {
                document.getElementById("status").innerHTML = "Error fetching returns data: " + error.message;
            }
        }

        async function get_portfolio(token, appid, ticker) {
            try {
                var response = await fetch(`https://ftl.fasttrack.net/v1/portfolio/${ticker}`, {
                    headers: {
                        token: token,
                        appid: appid
                    }
                });
                var portfolio = await response.json();

                if (portfolio.err) {
                    throw new Error(portfolio.err.message);
                }

                var holdings_columns = ["ticker", "name", "percentage"];
                var holdings_html = "<thead><tr>";
                holdings_columns.forEach(col => {
                    holdings_html += `<th>${col}</th>`;
                });
                holdings_html += "</tr></thead>";
                portfolio.holdings.forEach(stat => {
                    holdings_html += "<tr>";
                    holdings_columns.forEach(col => {
                        holdings_html += `<td>${stat[col]}</td>`;
                    });
                    holdings_html += "</tr>";
                });

                document.getElementById("table_top10").innerHTML = holdings_html;

                var sector_columns = ["sector", "percentage"];
                var sector_html = "<thead><tr>";
                sector_columns.forEach(col => {
                    sector_html += `<th>${col}</th>`;
                });
                sector_html += "</tr></thead>";
                portfolio.sectors.forEach(stat => {
                    sector_html += "<tr>";
                    sector_columns.forEach(col => {
                        sector_html += `<td>${stat[col]}</td>`;
                    });
                    sector_html += "</tr>";
                });

                document.getElementById("table_sector").innerHTML = sector_html;
            } catch (error) {
                document.getElementById("status").innerHTML = "Error fetching portfolio data: " + error.message;
            }
        }

        async function get_chart(token, appid, ticker) {
            try {
                var response = await fetch(`https://ftl.fasttrack.net/v1/chart/${ticker}`, {
                    headers: {
                        token: token,
                        appid: appid
                    }
                });
                var chart = await response.json();

                if (chart.err) {
                    throw new Error(chart.err.message);
                }

                Highcharts.chart('chart_line', {
                    title: {
                        text: ticker + " - Growth Chart"
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Growth'
                        }
                    },
                    series: [{
                        name: ticker,
                        data: chart.series[0].data.map((point, index) => [
                            new Date(chart.series[0].dates[index]).getTime(),
                            point
                        ]),
                        tooltip: {
                            valueDecimals: 2
                        }
                    }]
                });
            } catch (error) {
                document.getElementById("status").innerHTML = "Error fetching chart data: " + error.message;
            }
        }

        async function login() {
            let account = document.getElementById("txtaccount").value;
            let password = document.getElementById("txtpassword").value;
            let appid = document.getElementById("txtappid").value;

            if (account.length > 0 && password.length > 0 && appid.length > 0) {
                try {
                    let response = await fetch(`https://ftl.fasttrack.net/v1/auth/login?account=${account}&pass=${password}&appid=${appid}`);
                    let token_data = await response.json();

                    if (token_data.err) {
                        document.getElementById("status").innerHTML = token_data.err.message;
                    } else {
                        sessionStorage.setItem('fasttrack_token', token_data.token);
                        sessionStorage.setItem('fasttrack_appid', appid);
                        document.getElementById("status").innerHTML = "Login successful. You can now fetch data.";
                    }
                } catch (error) {
                    document.getElementById("status").innerHTML = "Error logging in: " + error.message;
                }
            } else {
                document.getElementById("status").innerHTML = "Account, Password, and App ID are all required.";
            }
        }
    };
})();
