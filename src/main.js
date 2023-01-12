import Swal from 'sweetalert2';

const conversionRates = {};
window.conversionRates = conversionRates;

const boardEl = document.getElementById('board');
const caixaEl = document.getElementById('board-interior');
const moedaEl = document.getElementById('insertion');
const btnEl = document.getElementById('search');
btnEl.setAttribute('disabled', 'disabled');

function errorDialog(error) {
  Swal.fire({
    title: 'Error:',
    text: `${error}`,
    icon: 'error',
    confirmButtonText: 'OK',
  });
}

moedaEl.addEventListener('keyup', () => {
  if (moedaEl.value.length === 3) {
    btnEl.removeAttribute('disabled');
  } else {
    btnEl.setAttribute('disabled', 'disabled');
  }
});

async function rateForCoin(baseCoin) {
  const coin = baseCoin.toUpperCase();

  if (!conversionRates[coin]) {
    const URL = `https://api.exchangerate.host/latest?base=${coin}`;
    const options = {
      method: 'GET',
      headers: { Accept: 'application/json' },
    };
    let json;
    try {
      const response = await fetch(URL, options);
      json = await response.json();
    } catch (error) {
      errorDialog(error);
      return {};
    }

    if (coin !== json.base) {
      errorDialog(`Not recognized: ${baseCoin}. Try USD.`);
      boardEl.classList.add('invisible');
      return {};
    }
    // console.log(json);
    conversionRates[coin] = json.rates;
  }
  /*  if (!conversionRates[coin]) {
    throw new Error('erro muito sinistro');
  } */
  return conversionRates[coin];
}

btnEl.addEventListener('click', async () => {
  const moeda = moedaEl.value;

  const rate = await rateForCoin(moeda);
  caixaEl.innerText = '';

  const moedaPedidaEl = document.getElementById('moeda_pedida');
  moedaPedidaEl.innerText = moeda;
  boardEl.classList.remove('invisible');

  Object.keys(rate).forEach((moedaAqui) => {
    const valor = rate[moedaAqui];
    // console.log(moeda, valor);
    const variavel = document.createElement('div');
    variavel.classList.add('caixinha');
    variavel.innerHTML = `
        <img src="src/moedas.svg" alt="">
        <span class="moeda">${moedaAqui}</span>
        <span class="valor">${valor.toFixed(3)}</span>
        `;
    caixaEl.appendChild(variavel);
  });

  // console.log(rate);
});
