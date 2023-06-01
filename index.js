/*
// extruturação dos nodos de entrada
const entrada = require('./ArquivosEnt/entrada.json');

const nodos = [];

//Itera por todos os registros
entrada.map(i => {
  const destinos = [];
  //se já estiver na lista, já foi tratado
  if (nodos.find(nw => { return nw.origem === i.origem }))
    return;

  //busca todas os objetos com mesma origem
  const nodosAux = entrada.filter(inp => {
    return inp.origem === i.origem
  });

  //itera as origens iguais montando os destinos possíveis
  nodosAux.map(n => {
    destinos.push({
      "destino": n.destino,
      "peso": n.peso
    })
  });

  //Caso tenha um nodo com destino para o atual e não possui caminho para o mesmo
  //adiciona 0
  const nodosAux2 = entrada.filter(inp => {
    return (inp.destino === i.origem && !destinos.find(nw => { nw.destino === inp.origem }));
  });
  nodosAux2.map(n => {
    destinos.push({
      "destino": n.origem,
      "peso": 0
    })
  });

  //ordena os destinos pelo peso de forma decrescente
  destinos.sort((a, b) => {
    if (a.peso > b.peso)
      return -1;

    if (a.peso < b.peso)
      return 1;

    return 0;
  })

  //Adiciona os destinos no novo objeto
  nodos.push({
    "origem": i.origem,
    destinos
  })
});

//ordernar pela origem pois o nodo de partida é o nodo 1
nodos.sort((a, b) => {
  if (a.origem > b.origem)
      return 1;

    if (a.origem < b.origem)
      return -1;

    return 0;  
});

const FileSystem = require("fs");
FileSystem.writeFile('./ArquivosEnt/nodos.json', JSON.stringify(nodos), (error) => {
  if (error) throw error;
});

//*/

//Exemplo da aula
/*
const nodoOrigem = 1;
const nodoDestino = 5;
const arquivo = 'nodosEx';//*/

//Trabalho
const nodoOrigem = 1;
const nodoDestino = 5;
const arquivo = 'nodosEx';

const nodos = require(`./ArquivosEnt/${arquivo}.json`);

const iteracoes = [];
let caminho = []; //caminho que será percorrido
let nodosVist = []; //todos nodos visitados

function BuscaCaminho(nodo) {
  if (nodosVist.find(nw => { return nw === nodo.origem })) return false; //se já esteve no nodo não pode

  nodosVist.push(nodo.origem); //adiciona nodo como visitado

  //busca os destinos com peso maior que 0 e que ainda não foram visitados 
  const destinosAux = nodo.destinos.filter(d => {
    return d.peso > 0 && !nodosVist.find(nV => { nV === d.destino })
  });

  //ordena os destinos conforme o peso de forma decrescente
  destinosAux.sort((a, b) => {
    if (a.peso > b.peso)
      return -1;

    if (a.peso < b.peso)
      return 1;

    return 0;
  })

  //variável de controle para identificar se chegou ao final
  let adicionouCaminho = false;

  //percorre todos os destinos possíveis
  destinosAux.map(d => {
    if (adicionouCaminho) return; //se já chegou no final não precisa continuar a iteração

    //caso o destino seja o objetivo adiciona no caminho e pode começar a desempilhar
    if (d.destino === nodoDestino) {
      nodosVist.push(d.destino);
      caminho.unshift({
        "nodoOrigem": nodo.origem,
        "nodoDestino": d.destino,
        "peso": d.peso
      });
      adicionouCaminho = true;
      return;
    }

    //busca o nodo na lista de nodos que corresponde ao caminho que será iterado
    const nodoAux = nodos.filter(n => {
      return n.origem === d.destino
    });

    //como não chegou no destino itera pelo próximo nodo
    if (BuscaCaminho(nodoAux[0])) {
      //se retornou true quer dizer que chegou no final, então pode adicionar na lista 
      //usa unshift para adicionar no início da lista (lista é montada de trás para frente)
      caminho.unshift({ 
        "nodoOrigem": nodo.origem,
        "nodoDestino": d.destino,
        "peso": d.peso
      });
      adicionouCaminho = true;
      return;
    }
  });

  return adicionouCaminho;
}

function AtualizaPeso() {
  caminho.sort((a, b) => {
    if (a.peso > b.peso)
      return 1;

    if (a.peso < b.peso)
      return -1;

    return 0;
  })

  const pesoAjuste = caminho[0].peso;

  caminho.map(c => {
    //Ajustar nodo origem (subtrai)
    nodos.find(n => {return n.origem === c.nodoOrigem}).destinos.find(d => {return d.destino === c.nodoDestino}).peso -= pesoAjuste;
    //Ajustar nodo destino (soma)
    nodos.find(n => {return n.origem === c.nodoDestino}).destinos.find(d => {return d.destino === c.nodoOrigem}).peso += pesoAjuste;
  })
}

let chegouDestino = true;
let iteracao = 0;
while (chegouDestino) { //enquanto as iterações chegarem no destino está conseguindo transferir peso até o final
  const nodoIni = nodos.filter(n => { return n.origem === nodoOrigem }); // busca o objeto inicial (nodo de partida)
  chegouDestino = BuscaCaminho(nodoIni[0]); 
  if (chegouDestino){
    iteracao+=1;
    //console.log(`Iteração: ${iteracao}`)
    //console.log(JSON.stringify(caminho))
    AtualizaPeso(); //se chegou no destino é atualizado os pesos
    iteracoes.push(caminho);
    //limpa variáveis auxiliares
    nodosVist = [];
    caminho = [];
  }
}

//grava arquivo com final para visualização futura
const FileSystem = require("fs");
FileSystem.writeFile(`./ArquivosEnt/${arquivo}Final.json`, JSON.stringify(nodos), (error) => {
  if (error) throw error;
});

let pesoTotal = 0;
//soma pesos do nodo destino
nodos.find(n => {return n.origem === nodoDestino}).destinos.map(d => {
  pesoTotal += d.peso;
})

console.log(`Peso total do nodo ${nodoOrigem} até ${nodoDestino} com ${iteracao} iterações, peso total no destino: ${pesoTotal}`)