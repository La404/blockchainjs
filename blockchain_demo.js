const SHA256 = require("crypto-js/SHA256");

class Block{

	constructor(data){
		this.index = 0;
		this.data = data;
		this.previousHash = '';
		this.timestamp = Date.now();
		this.nonce = 0;
		this.hash = this.calculateHash();
	}

	calculateHash(){
		return SHA256(this.index+JSON.stringify(this.data)+this.previousHash+this.timestamp+this.nonce).toString()
	}

	mineBlock(difficulty){
		console.log('Mining...')
		while(this.hash.substring(0,difficulty) !== '0'.repeat(difficulty)){
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log('BLOCK MINED:'+this.hash)
	}
}


class Blockchain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.pow = 1;
	}

	createGenesisBlock(){
		return new Block([new Transaction('','',1000)]);
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addNewBlock(newBlock){
		newBlock.index = this.getLatestBlock().index + 1;
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.pow);
		this.chain.push(newBlock);
	}

	isChainValid(){
		return validateChain(this.chain,this.pow)
	}

	findTx(txf){
		return this.chain.some((block)=>{
			return findTransaction(block.data,txf);
		})
	}
}

class Transaction{
	constructor(from, to, amount){
		this.from = from;
		this.to = to;
		this.amount = amount;
		this.timestamp = Date.now();
		this.hash = this.calculateHash();
	}
	calculateHash(){
		return SHA256(this.from+this.to+this.amount)
	}
}

let findTransaction = (txs,txf)=>{
	return txs.find((tx)=>tx.hash == txf.hash); 
}

let validateChain = (chain,pow)=>{

	return chain.every((currentBlock)=>{
		if( currentBlock.index > 0){
			const previousBlock = chain[currentBlock.index - 1];

	        if (previousBlock.index + 1 !== currentBlock.index) {
	            return false;
	        }
	        if (currentBlock.previousHash !== previousBlock.hash) {
	            return false;
	        }
	        if (currentBlock.hash.substring(0,pow) !== '0'.repeat(pow)) {
	            return false;
	        }
		}

		if (currentBlock.hash !== currentBlock.calculateHash()) {
            return false;
        }

        return true;
	})
}


module.exports = { Blockchain, Block, Transaction }

module.exports.findTransaction = findTransaction;
module.exports.validateChain = validateChain;

hackBlockchain = (chain)=>{

	chain.forEach((currentBlock)=>{
		if( currentBlock.index > 0){
			const previousBlock = chain[currentBlock.index - 1];

	        if (currentBlock.previousHash !== previousBlock.hash) {
	            currentBlock.previousHash = previousBlock.hash;
	        }
		}

		if (currentBlock.hash !== currentBlock.calculateHash()) {
            currentBlock.hash = currentBlock.calculateHash();
        }
	})
}

bc_academy = new Blockchain;

console.log(bc_academy)

block_one = new Block([new Transaction('Maria','Seven',120)]);
bc_academy.addNewBlock(block_one)

block_two = new Block([new Transaction('Alice','Dany',100)])
bc_academy.addNewBlock(block_two)

uno = new Transaction('Maria','Sevent',120)
dos = new Transaction('Alice','Dany',100)

console.log(bc_academy)