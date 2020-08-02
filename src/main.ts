// This is a test file, do not leave them to production

import Lexer from './query/processor/lexer/Lexer';
import SymbolTable from './query/processor/symbol-table/SymbolTable';
import TokenType from './query/processor/lexer/token/TokenType';
import Parser from './query/processor/parser/Parser';
import QueryAlgebra from './query/processor/parser/algebra/QueryAlgebra';
import Optimizer from './query/optimizer/Optmizer';

const program = `
SELECT employee.lname
FROM employee, works_on, project
WHERE employee.pname = 'Aquarius' AND project.pnumber = works_on.pno AND employee.ssn = works_on.ssn AND project.pdate > '2020-10-03';
`;

// const program = `
// SELECT product.name
// FROM product, category
// WHERE product.id_category = category.id AND product.value > 50.00;
// `;

const sb = new SymbolTable();
const lexer = new Lexer();
const tokens = lexer.start(program);

console.log(tokens);

// const parser = new Parser(tokens, sb);

// const tree = parser.getTree();

// Optimizer.optmizeQuery(tree, sb)
// tree.postOrder(tree.getRoot())
// console.log(sb);

// const qAlgebra = parser.getData();
// qAlgebra.optimizeTree();
