const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const YAML = require('yaml')

const rcPath = path.resolve(os.homedir(), '.profitrc.yaml')

const config = {
    config: undefined,
    rcPath,
    yaml: undefined,
    load() {
        if (this.config)
            return this.config

        if (!fs.existsSync(rcPath)) {
            fs.writeFileSync(rcPath, `---
alert:
  frequency: 5m
watch:
  rsi:
    - exchange: binance
      symbol: btcusdtperp
      timeframe: 15
`)
        }

        this.yaml = fs.readFileSync(rcPath, 'utf8')
        this.config = YAML.parse(this.yaml)

        return this.config
    },

    save() {
        fs.writeFileSync(rcPath, YAML.stringify(this.config), 'utf8')
    },

    get(key) {
        const config = this.load()

        if (!key) {
            return config
        }

        return config[key]
    },

    getAlertFrequency() {
        const config = this.load()

        return config.alert.frequency || '5m'
    },
}

module.exports = config
