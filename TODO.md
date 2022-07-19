# To Do

## Functionalities

- [ ] Funding Rate
- [ ] Open Interest
- [ ] Long/Short Ratio
- [ ] RSI Oversold/Overbought

## Command Line Interface

```sh
#
profit init

#
profit lucky

#
profit watch rsi list
profit watch rsi add binance:btcusdtperp 15m
profit watch rsi remove binance:btcusdtperp
profit watch rsi prune
```

## Configuration File

```sh
cat << EOF > ./.profitrc.yaml
---
watch:
  rsi:
    - exchange: binance
      symbol: btcusdtperp
      timeframe: 15
EOF
```
