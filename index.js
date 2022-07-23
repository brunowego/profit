const TradingView = require('@mathieuc/tradingview')
const notifier = require('node-notifier')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const YAML = require('yaml')
const chalk = require('chalk')
const humanizeDuration = require('humanize-duration');

process.title = 'profit';

const { DEBUG } = process.env;
const rcPath = path.resolve(os.homedir(), '.profitrc.yaml')
const yaml = fs.readFileSync(rcPath, 'utf8')
const config = YAML.parse(yaml)
const notify = config.notify
const frequency = notify.frequency * 1000
const rsi = config.watch.rsi
const log = console.log;

const nDate = new Date().toLocaleString(config.locale, {
  timeZone: config.timezone
});

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
    const crsi = chartStudy.periods[0]['RSI'].toFixed(0)

    if (DEBUG) log(chalk.magentaBright('%s — RSI of %s:%s is %s'), nDate, m.source, m.symbol, crsi)

    let oversold = crsi < rsi.oversold
    let overbought = crsi > rsi.overbought

    if (oversold || overbought) {
      let status = oversold ? 'oversold' : 'overbought'

      if (notify.enabled) {
        notifier.notify({
          title: 'Profit Alert',
          message: `${m.source}:${m.symbol} in ${status}. Timeframe ${m.timeframe.toString()}.`,
          sound: notify.sound
        })
      }

      log(
        chalk.green('%s — %s:%s in %s. Timeframe %s.'),
        nDate, m.source, m.symbol, status, m.timeframe.toString()
      );
    }

    client.end()
  })
};

log(chalk.green('Checking RSI every %s.'), humanizeDuration(frequency));
log(chalk.green('Verification cycle started at %s!'), nDate)

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

log('Running...')
