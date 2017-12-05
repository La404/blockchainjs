const SHA256 = require('crypto-js/SHA256');

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
		return SHA256(this.index+JSON.stringify(this.data)+this.previousHash+this.timestamp+this.nonce).toString();
	}

	mineBlock(difficulty){
		console.log('Mining...')
		while(this.hash.substring(0,difficulty) !== "0".repeat(difficulty)){
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log('BLOCK MINED:'+this.hash)
	}
}

class Blockchain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;
	}

	createGenesisBlock(){
		return new Block('Welcome blockchain');
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addNewBlock(newBlock){
		let previousBlock = this.getLatestBlock();
		newBlock.index = previousBlock.index + 1;
		newBlock.previousHash = previousBlock.hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isValidChain(){
		return Blockchain.validateChain(this.chain, this.difficulty);
	}

	static validateChain(chain,pow){
		return chain.reduce((previous,actual)=>{
			if (!previous){
				return null;
			}
			if (previous.index != actual.index-1){
				return null;
			}
			if (previous.hash != actual.previousHash){
				return null;
			}
			if (actual.hash != actual.calculateHash()){
				return null;
			}

			if (actual.hash.substring(0,pow) != "0".repeat(pow)){
				return null;
			}

			return actual;
		})

	}

}

module.exports = { Block, Blockchain }

// hackBlockchain = (chain)=>{

// 	chain.forEach((currentBlock)=>{
// 		if( currentBlock.index > 0){
// 			const previousBlock = chain[currentBlock.index - 1];

// 	        if (currentBlock.previousHash !== previousBlock.hash) {
// 	            currentBlock.previousHash = previousBlock.hash;
// 	        }
// 		}

// 		if (currentBlock.hash !== currentBlock.calculateHash()) {
//             currentBlock.hash = currentBlock.calculateHash();
//         }
// 	})
// }

// academy = new Blockchain;

//  block1 = new Block({ from: 'Brian', amount:100});
// console.log(block1);

//  block2 = new Block({ from: 'Manuel', amount:120});
// console.log(block2);

//  block3 = new Block({ from: 'Miguel', amount:90});
// console.log(block3);

// academy.addNewBlock(block2);
// academy.addNewBlock(block1);
// academy.addNewBlock(block3);

// console.log(academy.chain);
