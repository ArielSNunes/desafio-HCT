'use strict'
import $ from 'jquery'
import Swal from 'sweetalert2'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'

// Objeto default para o gerenciamento dos valores
const changesObj = {
  'value:100.00': { qt: 0, value: 100 },
  'value:50.00': { qt: 0, value: 50 },
  'value:20.00': { qt: 0, value: 20 },
  'value:10.00': { qt: 0, value: 10 },
  'value:5.00': { qt: 0, value: 5 },
  'value:2.00': { qt: 0, value: 2 },
  'value:1.00': { qt: 0, value: 1 },
  'value:0.50': { qt: 0, value: 0.50 },
  'value:0.25': { qt: 0, value: 0.25 },
  'value:0.10': { qt: 0, value: 0.10 },
  'value:0.05': { qt: 0, value: 0.05 },
}

// Selectors
const SELECTORS = {
  newProdBtn: '#newProdBtn',
  calcBtn: '#calcBtn',
  recievedValue: '#recievedValue',
  changeValue: '#change',
  productsList: '#products [data-js="product-wrapper"]',
  totalInput: '#totalValue',
  tableColumn: '#tableColumn',
  removeBtn: '[data-js="remove:btn"]'
}

{
  // Reseta os números da tabela de troco
  function resetTable() {
    $(SELECTORS.tableColumn).find('.qt').text(0)
  }
  // Função para adicionar o evento no botão de remover um campo de produto
  function reloadEventOnCloseBtn() {
    $(SELECTORS.removeBtn).click(function (e) {
      $(e.currentTarget).parent().parent().remove()
    })
  }
  // Função para adicionar um campo de produto
  // Invoca a função "reloadEventOnCloseBtn" para adicionar o evento no X
  function newProdBtnClick(e) {
    $(SELECTORS.productsList + ':last')
      .clone().appendTo('#products')
      .find('input').val('')
    reloadEventOnCloseBtn(e)
  }
  // Função que percorre a lista de produtos e returna um array com os valores
  function generatePricesArray() {
    return $(SELECTORS.productsList).map(function (i, prodItem) {
      return parseFloat($(prodItem).children().children('input').val())
    }).toArray()
  }
  // função que recebe um array de valores e retorna o valor total da compra
  function calculateTotal(pricesArr) {
    return pricesArr.reduce(function (prev, curr) {
      return prev + curr
    }, 0)
  }
  // Função que recebe o total da compra e retorna o do troco, baseado no valor pago pelo cliente
  function calculateChangeCoins(total) {
    return parseFloat($(SELECTORS.recievedValue).val() - total).toFixed(2)
  }
  // Função que recebe o troco e calcula quais notas/moedas devolver para o cliente
  function calculateWhatToReturnToClient(change) {
    let iterationChange = change
    const newObj = {}
    return Object.keys(changesObj).map(function (singleChangeObj, i) {
      if (changesObj[singleChangeObj].value <= iterationChange) {
        const qt = parseInt(iterationChange / changesObj[singleChangeObj].value)
        newObj[singleChangeObj] = {}
        newObj[singleChangeObj].qt = qt
        if (qt) {
          newObj[singleChangeObj].value = changesObj[singleChangeObj].value
        }
        iterationChange = (parseFloat(iterationChange - (qt * changesObj[singleChangeObj].value)).toFixed(2))
      }
      return newObj[singleChangeObj]
    })
  }
  // Função que recebe as notas/moedas que o cliente deve receber, e atualiza a tabela
  function fillTable(separatedChanges) {
    const arr = separatedChanges.filter(item => item)
    if (arr.length > 0) {
      arr.forEach(function (singleChange, i) {
        $(SELECTORS.tableColumn)
          .find(`[data-js="value:${singleChange.value.toFixed(2)}"] .qt`)
          .text(singleChange.qt)
      })
    }
  }
  // Função que começa a realizar as operações após o clique no botão calcular
  function calcBtnClick() {
    resetTable()
    const pricesArr = generatePricesArray()
    const total = calculateTotal(pricesArr)
    if (isNaN(total))
      return
    $(SELECTORS.totalInput).val(total)
    const change = calculateChangeCoins(total)
    if (change < 0)
      return Swal.fire({
        type: 'error',
        title: 'Ocorreu um erro',
        text: 'Dinheiro insuficiente para pagar a conta'
      })
    $(SELECTORS.tableColumn).fadeIn()
    $(SELECTORS.changeValue).text(`R$ ${change}`)
    const objToFillTable = calculateWhatToReturnToClient(change)
    fillTable(objToFillTable)
  }

  // Eventos
  $(SELECTORS.newProdBtn).click(newProdBtnClick)
  $(SELECTORS.calcBtn).click(calcBtnClick)
}