let fs = require('fs');
 
exports.solve = function(fileName) {
  let formula = readFormula(fileName);
  let result = doSolve(formula.clauses, formula.variables);
  return result;
}
 
// Verifica se uma permutação dos valores das variáveis é a última
function isLastAssignment(assignment) {
  // Busca pela primeira ocorrência de um elemento falso
    let i = 0;
  while(i < assignment.length && assignment[i] == true) {
    i++;
  }
 
  // Se foi após a última posição, retorna verdadeiro
  return i == assignment.length;
}
 
function nextAssignment(assignment) {
    // Busca o pivô da subistituição do fim para o começo e seta cada posição
  // como falso, até o pivô
    let i = assignment.length - 1;
    while (i >= 0 && assignment[i] == true) {
        assignment[i] = false;
    i--;
  }
 
  // Define o pivô como verdadeiro
  if(i >= 0 && assignment[i] == 0) {
    assignment[i] = true;
  }
 
    return assignment;
}
 
function testAssignment(clauses, assignment) {
  // Verifica cada cláusula
  for(let i in clauses) {
    let clause = clauses[i];
 
    // Verifica cada variável de uma cláusula
    let foundTrue = false;
    for(let j in clause) {
      let variable = clause[j];
 
      // Nega a variável, se necessário
      if(variable < 0) {
        foundTrue = !assignment[-variable - 1];
      } else {
        foundTrue = assignment[variable - 1];
      }
 
      // Ao achar um verdadeiro dentro de uma cláusula, passa para a próxima
      if(foundTrue) {
        break;
      }
    }
 
    // Ao achar uma cláusula falsa, a fórmula não é satisfatível
    if(!foundTrue) {
      return false;
    }
  }
 
  return true;
}
 
function doSolve(clauses, assignment) {
  // Testa a permutação inicial
  let isSat = testAssignment(clauses, assignment);
 
  // Testa as próximas permutações
  while (!isSat && !isLastAssignment(assignment)) {
    assignment = nextAssignment(assignment);
 
    isSat = testAssignment(clauses, assignment);
  }
 
  let result = {'isSat': false, satisfyingAssignment: null};
  if (isSat && clauses.length > 0 && assignment.length > 0) {
    result.isSat = true;
    result.satisfyingAssignment = assignment;
  }
 
  return result;
}
 
function readClauses(text) {
  let clauses = [];
 
  // Divide o arquivo em um array de linhas
  let lines = text.split('\n');
 
  let clause = [];
  for(let i in lines) {
    let line = lines[i];
 
    // Ignora linhas vazias, de comentário ou do problema
    if(!line || line.startsWith('c') || line.startsWith('p')) {
      continue;
    }
 
    // Tira os espaços a direita e a esquerda da linha
    line = line.trim();
 
    // Divide a linha nos espaços
    // Usa "/\s+/" para aceitar mais de um espaço entre as variáveis
    let aux = line.split(/\s+/);
 
    // Concatena as novas variáveis com as anteriores
    clause = clause.concat(aux);
 
    // Se chegou no fim da cláusula, processa
    if(clause.length > 0 && clause[clause.length - 1] == '0') {
      // Retira o zero do final
      clause.pop();
 
      // Converte os valores para inteiros
      clause = clause.map(Number);
 
      // Adiciona ao array de cláusulas
      clauses.push(clause);
 
      // Reseta a cláusula atual
      clause = [];
    }
  }
 
  return clauses;
}
 
function readVariables(clauses) {
  let variables = [];
 
  for(let i in clauses) {
    let clause = clauses[i];
 
    for(let j in clause) {
      let variable = clause[j];
 
      // Caso a variável for negada, retirar a negação
      if(variable < 0) {
        variable = -variable;
      }
 
      // Só adiciona a variável se ela ainda não foi incluída
      if(!variables.includes(variable)) {
        variables.push(variable);
      }
    }
  }
 
  // Ordena as variáveis
  variables.sort((a, b) => a - b);
 
  return variables;
}
 
function checkProblemSpecification(text, clauses, variables) {
  // Divide o arquivo em um array de linhas
  let lines = text.split('\n');
 
  for(let i in lines) {
    let line = lines[i];
 
    // Reconhece a linha do problema
    if(line.startsWith('p')) {
      // Tira os espaços a direita e a esquerda da linha
      line = line.trim();
 
      // Divide os argumentos do problema
      let problem = line.split(/\s+/);
 
      let variablesAmount = parseInt(problem[2]);
      let clausesAmount = parseInt(problem[3]);
 
      // Verifica se a quantidade de variáveis e cláusulas
      // bate com a especificação
      let variablesMatches = variablesAmount == variables.length;
      let clausesMatches = clausesAmount == clauses.length;
 
      // Verifica se as variáveis utilizadas estão no range 1-N
      // Basta verificar o primeiro e o último, pois é garantido que:
      //   1 - Não há repetições
      //   2 - As variáveis estão ordenadas
      let n = variablesAmount;
      variablesMatches = variablesMatches && variables[0] == 1;
      variablesMatches = variablesMatches && variables[n - 1] == n;
 
      // Se variáveis e cláusulas batem com a especificação
      if(variablesMatches && clausesMatches) {
        return true;
      } else {
        return false;
      }
    }
  }
 
  return false;
}
 
function initialAssignment(amount) {
  // Inicia o array vazio
  let assignment = new Array(amount);
 
  // Preenche com falso
  for(let i = 0; i < amount; i++) {
    assignment[i] = false;
  }
 
  return assignment;
}
 
function readFormula(fileName) {
  // Le e separa as partes do arquivo
  let text = fs.readFileSync('./' + fileName).toString();
  let clauses = readClauses(text);
  let variables = readVariables(clauses);
 
  // Verifica se as cláusulas e variáveis batem com a especificação
  let specOk = checkProblemSpecification(text, clauses, variables);
 
  // Monta o objeto de retorno
  let result = { 'clauses': [], 'variables': [] };
  if (specOk) {
    result.clauses = clauses;
    result.variables = initialAssignment(variables.length);
  }
 
  return result;
}
