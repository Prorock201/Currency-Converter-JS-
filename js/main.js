window.onload = startConverter;

function startConverter(){
	var uah = {};
	var bankUrl = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
	var httpRequest;
	var currencyFrom = document.getElementById('from');
	var currencyTo = document.getElementById('to');
	var exchange = document.getElementById('exchange');
	exchange.addEventListener('click', getExchange);

	if (window.XMLHttpRequest) {
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState == 4 && httpRequest.status == 200){
			getCurrency(httpRequest);
		}
	};
	httpRequest.open('GET', bankUrl, true);
	httpRequest.send(null);

	function getCurrency(httpRequest){
		uah = JSON.parse(httpRequest.responseText);
		var fragment = document.createDocumentFragment();
		var element = document.createElement('option');
		element.value = 'UAH';
		element.text = 'UAH';
		fragment.appendChild(element);
		currencyFrom.appendChild(fragment.cloneNode(true));
		currencyTo.appendChild(fragment.cloneNode(true));
		uah.map(function(item,index){
			var currency = item.ccy;
			uah[currency] = {};
			uah[currency].buy = item.buy;
			uah[currency].sale = item.sale;
			element.value = currency;
			element.text = currency;
			fragment.appendChild(element);
			currencyFrom.appendChild(fragment.cloneNode(true));
			currencyTo.appendChild(fragment.cloneNode(true));
		});
	}

	function getExchange(){
		var amount = document.getElementById('amount').value;
		var curFromValue = currencyFrom.options[currencyFrom.selectedIndex].text;
		var curToValue = currencyTo.options[currencyTo.selectedIndex].text;
		var result = document.getElementById('result');
		if (/^\d*.?\d*$/.test(amount)){
			if (curFromValue === curToValue) {
				result.value = parseInt(amount).toFixed(2);
			} else if (curFromValue === 'UAH'){
				result.value = (amount/uah[curToValue].sale).toFixed(2);
			} else if (curToValue === 'UAH'){
				result.value = (amount*uah[curFromValue].buy).toFixed(2);
			} else {
				result.value = (amount*uah[curFromValue].buy/uah[curToValue].sale).toFixed(2);
			}
		} else {
			result.value = 'ОШИБКА: не верный ввод данных';
		}
	}
}

