var exchangeValueHistory = [];

async function fetchCurrencies() {
  const fetchUrl = "https://api.freecurrencyapi.com/v1/currencies";
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        apikey: apiKey,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching currencies: ${response.statusText}`);
    }
    const data = await response.json();
    if (data) {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    return null;
  }
}

async function getConvertionRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  let exchangeRate = checkCurrencyExchangeHistory(fromCurrency, toCurrency);
  if (exchangeRate) {
    console.log(exchangeRate, "from history");
    return exchangeRate;
  }

  const fetchUrl = `https://api.freecurrencyapi.com/v1/latest?base_currency=${fromCurrency}&apikey=${apiKey}&currencies=${toCurrency}`;
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Error fetching conversion rate: ${response.statusText}`);
    }
    const data = await response.json();
    if (data) {
      console.log(data.data[toCurrency]);
      exchangeValueHistory.push({
        from: fromCurrency,
        to: toCurrency,
        ratio: data.data[toCurrency],
      });
      return data.data[toCurrency];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch conversion rate:", error);
    return null;
  }
}

function checkCurrencyExchangeHistory(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return 1;
  }
  let exchangeRate = exchangeValueHistory.find(
    (item) => item.from === fromCurrency && item.to === toCurrency
  );
  if (exchangeRate) {
    return exchangeRate.ratio;
  }
  let exchangeRateReverse = exchangeValueHistory.find(
    (item) => item.to === fromCurrency && item.from === toCurrency
  );
  if (exchangeRateReverse) {
    return 1 / exchangeRateReverse.ratio;
  }
  return null;
}

function validateAmount(amount) {
  if (isNaN(amount)) {
    return "Amount must be a number";
  } else if (amount === "") {
    return "Amount must not be empty";
  } else if (amount <= 0) {
    return "Amount must be greater than 0";
  }
  return "";
}

var currencies_static_list = [
  "EUR",
  "USD",
  "JPY",
  "BGN",
  "DKK",
  "GBP",
  "HUF",
  "PLN",
  "RON",
  "SEK",
  "CHF",
  "ISK",
  "NOK",
  "HRK",
  "RUB",
  "TRY",
  "AUD",
  "BRL",
  "CAD",
  "CNY",
  "HKD",
  "IDR",
  "ILS",
  "INR",
  "KRW",
  "MXN",
  "MYR",
  "NZD",
  "PHP",
  "SGD",
  "THB",
  "ZAR",
];

document.addEventListener("DOMContentLoaded", async () => {
  // const currencies = await fetchCurrencies();
  // console.log(Object.keys(currencies["data"]));
  // if(Object.keys(currencies["data"]).length == 0 || !currencies){
  //   currencies = currencies_static_list;
  // }
  const currencies = currencies_static_list;

  const fromCurrencySelect = document.getElementById("from-currency-selector");
  const toCurrencySelect = document.getElementById("to-currency-selector");
  const targetAmountInput = document.getElementById("target-amount-input");
  const baseAmountInput = document.getElementById("base-amount-input");
  const baseAmountErrorP = document.getElementById("base-amount-error");

  currencies.forEach((currency) => {
    const option = document.createElement("option");
    option.value = currency;
    option.text = currency;
    fromCurrencySelect.appendChild(option);
  });

  currencies.forEach((currency) => {
    const option = document.createElement("option");
    option.value = currency;
    option.text = currency;
    toCurrencySelect.appendChild(option);
  });

  const convertButton = document.getElementById("convert-button");
  convertButton.addEventListener("click", async () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = baseAmountInput.value;

    const error = validateAmount(amount);
    if (error !== "") {
      baseAmountErrorP.innerHTML = error;
      return;
    }
    baseAmountErrorP.innerHTML = "";

    console.log(fromCurrency, toCurrency, amount);

    let conversionRate = await getConvertionRate(fromCurrency, toCurrency);
    if (conversionRate) {
      const convertedAmount = amount * conversionRate;
      targetAmountInput.value = `${convertedAmount.toFixed(2)}`;
    } else {
      targetAmountInput.value = "Error converting currency";
    }
  });

  baseAmountInput.addEventListener("input", () => {
    if (validateAmount(baseAmountInput.value) === "") {
      baseAmountErrorP.innerHTML = "";
    } else {
      baseAmountErrorP.innerHTML = validateAmount(baseAmountInput.value);
      return;
    }
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = baseAmountInput.value;

    let conversionRate = checkCurrencyExchangeHistory(fromCurrency, toCurrency);
    if (conversionRate) {
      const convertedAmount = amount * conversionRate;
      targetAmountInput.value = `${convertedAmount.toFixed(4)}`;
    } else {
      targetAmountInput.value = "Error converting currency";
    }
  });
});
