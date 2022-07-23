const TradingView = require('@mathieuc/tradingview')
const notifier = require('node-notifier')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const YAML = require('yaml')
const chalk = require('chalk')
const humanizeDuration = require('humanize-duration');

const rcPath = path.resolve(os.homedir(), '.profitrc.yaml')

yaml = fs.readFileSync(rcPath, 'utf8')
config = YAML.parse(yaml)
frequency = config.alert.frequency * 1000
rsi = config.watch.rsi

const checkRSI = async (m) => {
  const client = new TradingView.Client()
  const chart = new client.Session.Chart()

  chart.setMarket(`${m.source}:${m.symbol}`, {
    timeframe: m.timeframe.toString(),
    range: 100
  })

  const rsiIndicator = await TradingView.getIndicator('STD;RSI')

  const chartStudy = new chart.Study(rsiIndicator)

  chartStudy.onUpdate(() => {
    const latestPeriod = chartStudy.periods[0]
    // console.log(`RSI: ${latestPeriod['$time']} ${latestPeriod['RSI']}`)

    if (latestPeriod['RSI'] < rsi.oversold) {
      notifier.notify({
        title: 'Profit Alert',
        message: `${m.source}:${m.symbol} in Oversold`,
        sound: true
      })
    }

    if (latestPeriod['RSI'] > rsi.overbought) {
      notifier.notify({
        title: 'Profit Alert',
        message: `${m.source}:${m.symbol} in Overbought`,
        sound: true
      })
    }

    client.end()
  })
};

console.log(chalk.green('Checking RSI every %s.'), humanizeDuration(frequency));
console.log(chalk.green('Verification cycle started!'))

const eachMarket = () => {
  rsi.markets.forEach((m, index) => {
    setTimeout(() => {
      checkRSI(m)
    }, 1000 * (index + 1))
  })
}

eachMarket()

;(function loop() {
  setTimeout(() => {
    eachMarket()
    loop()
  }, frequency);
}());

console.log('Running...')
