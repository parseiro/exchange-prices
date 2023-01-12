import Swal from 'sweetalert2';

const conversionRates = {};
window.conversionRates = conversionRates;

function errorDialog(error) {
    Swal.fire({
        title: 'Error:',
        text: `${error}`,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}

async function rateForCoin(baseCoin) {
    baseCoin = baseCoin.toUpperCase();

    if (!conversionRates[baseCoin]) {
        const URL = `https://api.exchangerate.host/latest?base=${baseCoin}`;
        const options = {
            method: 'GET',
            headers: {'Accept': 'application/json'},
        };
        let json;
        try {
            const response = await fetch(URL, options);
            json = await response.json();
        } catch (error) {
            errorDialog(error);
            return;
        }

        if (baseCoin !== json.base) {
            errorDialog(`A moeda não existe neste sistema: ${baseCoin}`);
            return;
        }
        console.log(json);
        conversionRates[baseCoin] = json.rates;
    }
    if (!conversionRates[baseCoin]) {
        throw new Error('erro muito sinistro');
    }
    return conversionRates[baseCoin];

}

const caixaEl = document.getElementById('board-interior');
const moedaEl = document.getElementById('insertion');
const btnEl = document.getElementById('search');
btnEl.setAttribute("disabled", "disabled");
moedaEl.addEventListener('keyup', () => {
    if (moedaEl.value.length === 3) {
        btnEl.removeAttribute("disabled");
    } else {
        btnEl.setAttribute("disabled", "disabled");
    }
});


btnEl.addEventListener('click', async () => {

    const moeda = moedaEl.value;

    const rate = await rateForCoin(moeda);
    caixaEl.innerText = '';

    const moedaPedidaEl = document.getElementById('moeda_pedida');
    moedaPedidaEl.innerText = moeda;

    Object.keys(rate).forEach(moeda => {
        const valor = rate[moeda];
        // console.log(moeda, valor);
        const variavel = document.createElement('div');
        variavel.classList.add('caixinha');
        variavel.innerHTML = `
        <img src="src/moedas.svg" alt="">
        <span class="moeda">${moeda}</span>
        <span class="valor">${valor.toFixed(3)}</span>
        `;
        caixaEl.appendChild(variavel);
    })

    // console.log(rate);
});
