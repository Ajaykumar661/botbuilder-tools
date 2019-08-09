const antlr4 = require('antlr4');
const Position = require('./diagnostic').Position;
const Range = require('./diagnostic').Range;
const Diagnostic = require('./diagnostic').Diagnostic;

let LUErrorListener = function(errors) {
    antlr4.error.ErrorListener.call(this);
    this.errors = errors;
    return this;
}

LUErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
LUErrorListener.prototype.constructor = LUErrorListener;
LUErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
    const startPosition = new Position(line - 1, charPositionInLine);
    const stopPosition = new Position(line - 1, charPositionInLine + offendingSymbol.stopIndex - offendingSymbol.startIndex + 1);
    const range = new Range(startPosition, stopPosition);
    msg = `syntax error: ${msg}`;
    
    const diagnostic = new Diagnostic(range, msg);
    this.errors.push(diagnostic);
}

module.exports = LUErrorListener;