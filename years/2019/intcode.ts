export function runProgram(program: number[]): number[] {
	let instructionCounter = 0;

	while (program[instructionCounter] !== 99) {
		instructionCounter += execCommand(program, instructionCounter);
	}

	return program;
}

function execCommand(program: number[], instructionCounter: number): number {
	const opCode = program[instructionCounter];

	switch (opCode) {
		case 1:
			execWithPositionalArguments(program, instructionCounter, (x, y) => x + y);
			return 4;
		case 2:
			execWithPositionalArguments(program, instructionCounter, (x, y) => x * y);
			return 4;
		default:
			throw Error(`Unknown OpCode ${opCode}`);
	}
}

function execWithPositionalArguments(
	program: number[],
	instructionCounter: number,
	func: (x: number, y: number) => number
): void {
	program[program[instructionCounter + 3]] = func(
		program[program[instructionCounter + 1]],
		program[program[instructionCounter + 2]]
	);
}
