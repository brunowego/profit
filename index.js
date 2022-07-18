const TradingView = require('@mathieuc/tradingview')
const notifier = require('node-notifier');

const run = async () => {
  const client = new TradingView.Client()

  const chart = new client.Session.Chart()
  chart.setMarket('BINANCE:ETCUSDTPERP', {
    timeframe: '15',
    range: 100
  })

  const rsiIndicator = await TradingView.getIndicator('STD;RSI')

  const chartStudy = new chart.Study(rsiIndicator)

  chartStudy.onUpdate(() => {
    const latestPeriod = chartStudy.periods[0]
    console.log(`RSI: ${latestPeriod['$time']} ${latestPeriod['RSI']}`)

    if (latestPeriod['RSI'] > 69) {
      notifier.notify({
        title: 'Profit Alert',
        message: `ETCUSDTPERP in Oversold`,
        sound: true
      });
    }

    if (latestPeriod['RSI'] < 31) {
      notifier.notify({
        title: 'Profit Alert',
        message: `ETCUSDTPERP in Overbought`,
        sound: true
      });
    }
  })
}

run()
