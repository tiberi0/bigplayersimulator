//Variaveis de controle
var actionSimulator = 'play'
var myVar;// = setInterval(alertFunc, 1000);
var candleTick = 0;
var candles = [['0',15,15,15,15]]
var bookBuffer = []      
var negocios = [['0',0]]
var ultimoPreco = 1500;
var tick = 0;
var compraMercadoValor = 0;
var valorDisponivel = 1000000000;
var qtdEmCarteira = 0;

$('#valorDisponivel').html(kFormatter(valorDisponivel))
$('#qtdEmCarteira').html(kFormatter(qtdEmCarteira))

$(document).ready(function() {
  // executes when HTML-Document is loaded and DOM is ready
  //console.log("document is ready");
  var token = Cookies.get('token')
  if(token && token.length>0){
    var docUser = atob(token)
    if(docUser){
      var jsonUser = JSON.parse(docUser);
      $('#nameProfileUser').html(jsonUser.doc.name + ' ' + jsonUser.doc.last)
      $('#firsNameLastNameCaracter').html(jsonUser.doc.name[0].toUpperCase() + jsonUser.doc.last[0].toUpperCase())
    }else{
      window.location.replace('/');
    }
  }else{    
    var codeUser = (Math.random()*1000000).toFixed(0).toString();
    $('#nameProfileUser').html('User' + ' ' + codeUser)
    $('#firsNameLastNameCaracter').html('U' + codeUser[0])
  }
});

//Função para preparar o inicio da simulação
function playPauseSimulator(){    
    if(actionSimulator=='pause'){
        $('#iconPauseSimulator').hide()
        $('#iconPlaySimulator').show()
        actionSimulator = 'play'
        //id.className = "btn btn-success btn-circle";
        $('#buttonPlayPauseSimulator').attr('class','btn btn-success btn-circle')
        $('#buttonPlayPauseSimulator').attr('title','Retomar Simulação')
        stopTrade();
    }else{
        $('#iconPauseSimulator').show()
        $('#iconPlaySimulator').hide()
        actionSimulator = 'pause'
        $('#buttonPlayPauseSimulator').attr('class','btn btn-warning btn-circle')
        $('#buttonPlayPauseSimulator').attr('title','Pausar Simulação')
        startTrade();
        //id.className = "btn btn-warning btn-circles";
    }
}

//FUnção para iniciar a simulação
function startTrade(){
    if(tick==0){
        initVariables();    
        google.charts.load('current', {'packages':['corechart','table']});
        google.charts.setOnLoadCallback(drawChart); 
        google.charts.setOnLoadCallback(drawTable);     
    }
    //google.charts.setOnLoadCallback(drawTable);
    myVar = setInterval(tradeMonitor,1000);
}

//Parar trade
function stopTrade(){
    if(myVar)
      clearInterval(myVar);
}

//Iniciar varivies
function initVariables(){
    var ab = 15;//$('#valorAbertura').val()
    ultimoPreco = parseInt(ab)*100              
    candles[0][1] = ultimoPreco/100
    candles[0][2] = ultimoPreco/100
    candles[0][3] = ultimoPreco/100
    candles[0][4] = ultimoPreco/100   
    //PREENCHENDO BOOK (Ver LEILAO)
    for(var i = 0 ; i < 50; i++){
        bookBuffer.push([i,ultimoPreco-25+i])                    
    } 
}

function tradeMonitor() {
            
    lancarOrdensNoBook()

    drawTable('Compra'); 
    drawTable('Venda'); 

    $('#valorDisponivel').html(kFormatter(valorDisponivel))
    $('#qtdEmCarteira').html(kFormatter(qtdEmCarteira))

    var price = ultimoPreco/100;
    
    if(candles[candleTick][1]> price)
        candles[candleTick][1] = price
    
    candles[candleTick][2] = price

    if(candles[candleTick][4]< price)
        candles[candleTick][4] = price
    
    tick++;
    if(tick>=20){  
        tick = 0;              
        candleTick++; 
        candles.push([(candleTick*20).toString(),price,price,price,price])
        negocios.push([(candleTick*20).toString(),0])
    }

    drawChart();  

    $('#precoCorrente').html((price.toFixed(2)));
    var ab = 15//$('#valorAbertura').val()
    tempProc = parseInt(ab)*100   
    var variac = (((price/ab)*100)-100).toFixed(2);            
    $('#variacaoCorrente').html(variac + '%');
    if(variac<0){
       $('#cardVariacaoCorrente').attr('class','card border-left-deeppink shadow h-100 py-2')
       $('#textoVariacaoCorrente').attr('class','text-xs font-weight-bold text-deeppink text-uppercase mb-1')
    }else{
       $('#cardVariacaoCorrente').attr('class','card border-left-primary shadow h-100 py-2')
       $('#textoVariacaoCorrente').attr('class','text-xs font-weight-bold text-primary text-uppercase mb-1')
    }
}

function drawTable(tipo) {
    if(tipo==undefined)
      return

    var data = new google.visualization.DataTable();  
    var cor = 'red'
    if(tipo == "Compra"){
      data.addColumn('string', 'QTD');
      data.addColumn('string', 'Preço');              
      var cor = 'blue'
    }else{
      data.addColumn('string', 'Preço');              
      data.addColumn('string', 'QTD');
    }

    var tempBookOfertas = []
    for(var i  = 0 ; i < 5; i++){
      if(tipo=="Compra"){
        tempBookOfertas.push([kFormatter(bookBuffer[24-i][0]).toString(),bookBuffer[24-i][1].toString()]);
      }else{
        tempBookOfertas.push([bookBuffer[26+i][1].toString(),kFormatter(bookBuffer[26+i][0]).toString()]);
      }
    }

    data.addRows(tempBookOfertas);              

    var table = new google.visualization.Table(document.getElementById('table_div'+tipo));

    
    table.draw(data, 
    {
        showRowNumber: false,
        allowHtml: true,
        cssClassNames: {    
            oddTableRow: 'tableRow'+cor,
            tableRow: 'tableRow'+cor
        } , 
        width: '100%', 
        height: '100%'
    });
}

function lancarOrdensNoBook(){
    //var precoCorrente = ultimoPreco;
    liquidarNegocios();  
    //LANCAR RANDOMICO DE TENDENCIA E BOTAR NO PESO DO PRECO            
    for(var i = 0 ; i < 25; i++){
      bookBuffer[i][0] = bookBuffer[i][0] + ((Math.floor(Math.random() * 100) ) * i);
      bookBuffer[49-i][0] = bookBuffer[49-i][0] + ((Math.floor(Math.random() * 100) ) * i);                    
    }                            
}

function liquidarNegocios(){
  var randOk = Math.floor(Math.random() * 3)              
  //var compraMercadoValor = parseInt($('#compraMercado').val());
  if(compraMercadoValor!=0){                
    if(compraMercadoValor<0){
      randOk = 0;
      compraMercadoValor = compraMercadoValor*-1
    }else
      randOk = 1;
  }
  if(randOk==0){
    //price = price-1;//randOk
    //VENDER A MERCADO    
    var tentativas = 50;

    while(true){        
      tentativas--;                      
      var tempBuffer = []
      var negociosAgora = bookBuffer[26][0];
      //console.log(negociosAgora)
      if(tentativas<0 && negociosAgora==0){
        comprarMercado = 0;
        break;
      }
              
      negocios[candleTick.toString()][1] = negocios[candleTick.toString()][1] + negociosAgora
      bookBuffer[26][0] = 0;                               

      ultimoPreco = ultimoPreco-1; 
      tempBuffer.push([0,ultimoPreco-25])
      for(var i = 0 ; i < 49; i++){
        tempBuffer.push(bookBuffer[i])
      }
      bookBuffer = tempBuffer;     
      compraMercadoValor = compraMercadoValor - negociosAgora
      
      if(compraMercadoValor<0 || isNaN(compraMercadoValor)){
        compraMercadoValor = 0;
        //$('#compraMercado').val('0')
        break;
      }
    }
  }
  if(randOk==1){
    //price = price+1;//+randOk-5
    //COMPRAR A MERCADO 
    var tentativas = 50;
    while(true){      
      tentativas--;
      
      var tempBuffer = []
      
      var negociosAgora = bookBuffer[24][0];
      //console.log(negociosAgora)
      if(tentativas<0 && negociosAgora == 0){
        comprarMercado = 0;
        break;
      }
      negocios[candleTick.toString()][1] = negocios[candleTick.toString()][1] + negociosAgora
      bookBuffer[24][0] = 0;
      ultimoPreco = ultimoPreco+1;
      for(var i = 0 ; i < 49; i++){
        tempBuffer.push(bookBuffer[i+1])
      }
      tempBuffer.push([0,ultimoPreco+25])
      bookBuffer = tempBuffer; 
      compraMercadoValor = compraMercadoValor - negociosAgora      
      if(compraMercadoValor<0 || isNaN(compraMercadoValor)){
        compraMercadoValor = 0;
        //$('#compraMercado').val('0')
        break;
      } 
    }
    
  }
    // //LIQUIDANDO NEGOCIOS
    // if(bookOfertas[10][1] > bookOfertas[11][4]){
    //   //Tem mais venda q compra
    //   bookOfertas[10][1] -= bookOfertas[11][4]
    //   bookOfertas[11][4] = 0;

    // }else if(bookOfertas[10][1] < bookOfertas[11][4]){
    //   //Tem mais Compra q venda
    //   bookOfertas[11][4] -= bookOfertas[10][1]
    //   bookOfertas[10][1] = 0
    // }else{
    //   //Mesma quantidade de compra venda
    // }

}

//Renderizar grafico de candle
var dataCandle;
function drawChart() {
    dataCandle = google.visualization.arrayToDataTable(candles, true);

    var options = {
      legend:'none',
      candlestick: {
        hollowIsRising:true,
        fallingColor: { stroke:'#4e73df', strokeWidth: 0, fill: '#4e73df' }, // red
        risingColor: {stroke:'#FF1493', strokeWidth: 0, fill: '#FF1493' }   // green
      }
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(dataCandle, options);

    $('#columnchart_values').show();
    var data1 = google.visualization.arrayToDataTable(negocios,true);
    var chart1 = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
    chart1.draw(data1, options);
}

function comprarMercado(){
  try{
    var tempVol = parseInt($('#volume').val())    
    if(isNaN(tempVol))
      alert("Valor incompativel")
    valorDaAquisicao = tempVol*(ultimoPreco/100);
    if(valorDisponivel<valorDaAquisicao){
      alert('Sem grana')
    }else{
      compraMercadoValor = tempVol
      valorDisponivel = valorDisponivel-valorDaAquisicao
      qtdEmCarteira += tempVol;
    }
  }catch(ee){

  }
}

function venderMercado(){
  //compraMercadoValor = parseInt($('#volume').val())*-1
  try{
    var tempVol = parseInt($('#volume').val())    
    if(isNaN(tempVol)){
      alert("Valor incompativel")
      return
    }
    valorDaAquisicao = tempVol*(ultimoPreco/100);
    if(valorDisponivel<valorDaAquisicao){
      alert('Sem grana')
    }else{
      compraMercadoValor = tempVol*-1
      valorDisponivel = valorDisponivel+valorDaAquisicao
      qtdEmCarteira -= tempVol;
    }
  }catch(ee){

  }
}

function lancarOrdemPendente(){
  var tempVol = parseInt($('#volume').val())
  var tempPrec = parseInt($('#preco').val())
  if(isNaN(tempVol) || isNaN(tempPrec)){
    alert('Valores Incompativeis')
    return
  }
  console.log(tempPrec)
  for(var i = 0 ; i < 50; i++){
    if(bookBuffer[i][1]==tempPrec){
      bookBuffer[i][0] = bookBuffer[i][0] + tempVol
      break;
    }
  }
}

//FUNCOES AUXILIARES
function kFormatter(num) {
    var tempNum = Math.abs(num)
    if(tempNum<999)
      return Math.sign(num)*Math.abs(num)
    else if(tempNum > 999 && tempNum < 999999)
      return Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + ' k'
    else if(tempNum>999999 && tempNum < 999999999)
      return Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + ' mi'
    else 
      return Math.sign(num)*((Math.abs(num)/1000000000).toFixed(1)) + ' bi'
}

function logout(){
  Cookies.set('token','')
  window.location.replace('/')
}