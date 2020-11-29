import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2019;
const DAY = 6;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2019\06\index.ts
// data path    : D:\Development\advent-of-code\years\2019\06\data.txt
// problem url  : https://adventofcode.com/2019/day/6

interface OrbitRelation {
	parent: string;
	child: string;
}
async function p2019day6_part1(input: string) {
	const orbits: OrbitRelation[] = input.split("\n").map(x => {
		const [parent, child] = x.split(")");
		return { parent, child };
	});

	const graph = makeGraph(orbits);
	return Array.from(graph.keys())
		.map(key => depth(key, graph))
		.reduce((total, next) => total + next, 0);
}

interface GraphNode {
	name: string;
	orbits?: string;
}

function makeGraph(orbits: OrbitRelation[]) {
	const graphLookup = new Map<string, GraphNode>();

	for (let orbit of orbits) {
		createOrGetNode(graphLookup, orbit.parent, makeGraphNode);
		const childNode = createOrGetNode(graphLookup, orbit.child, makeGraphNode);
		childNode.orbits = orbit.parent;
	}

	return graphLookup;
}

function makeGraphNode(name: string): GraphNode {
	return { name };
}

function createOrGetNode<K, T>(lookup: Map<K, T>, key: K, generator: (key: K) => T): T {
	if (lookup.has(key)) {
		return lookup.get(key)!;
	} else {
		const newNode = generator(key);
		lookup.set(key, newNode);
		return newNode;
	}
}

function depth(start: string, graphLookup: Map<string, GraphNode>, currDepth: number = 0): number {
	const root = graphLookup.get(start);
	if (!root) {
		throw new Error(`Unable to find node ${start} in graph`);
	}

	if (root.orbits) {
		return depth(root.orbits, graphLookup, currDepth + 1);
	} else {
		return currDepth;
	}
}

async function p2019day6_part2(input: string) {
	const orbits: OrbitRelation[] = input.split("\n").map(x => {
		const [parent, child] = x.split(")");
		return { parent, child };
	});

	const graph = makeGraph(orbits);
	const myPathToRoot = pathToRoot("YOU", graph);
	const intersectPoint = findFirstIntersect("SAN", graph, myPathToRoot);

	if (!intersectPoint) {
		throw new Error(`No intersection point found; transfer impossible`);
	}

	return (
		directedDepth(graph.get("YOU")?.orbits!, intersectPoint, graph) +
		directedDepth(graph.get("SAN")?.orbits!, intersectPoint, graph)
	);
}

function pathToRoot(
	start: string,
	graphLookup: Map<string, GraphNode>,
	currPath: Set<string> = new Set<string>()
): Set<string> {
	const root = graphLookup.get(start);
	if (!root) {
		throw new Error(`Unable to find node ${start} in graph`);
	}

	currPath.add(root.name);

	if (root.orbits) {
		return pathToRoot(root.orbits, graphLookup, currPath);
	} else {
		return currPath;
	}
}

function findFirstIntersect(
	start: string,
	graphLookup: Map<string, GraphNode>,
	searchingFor: Set<string>
): string | undefined {
	const root = graphLookup.get(start);
	if (!root) {
		throw new Error(`Unable to find node ${start} in graph`);
	}

	if (searchingFor.has(root.name)) {
		return root.name;
	} else if (root.orbits) {
		return findFirstIntersect(root.orbits, graphLookup, searchingFor);
	}

	return undefined;
}

function directedDepth(start: string, end: string, graphLookup: Map<string, GraphNode>, currDepth = 0): number {
	const root = graphLookup.get(start);
	if (!root) {
		throw new Error(`Unable to find node ${start} in graph`);
	}

	if (start == end) {
		return currDepth;
	} else {
		return directedDepth(root.orbits!, end, graphLookup, currDepth + 1);
	}
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2019day6_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2019day6_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2019day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2019day6_part2(input));
	const part2After = performance.now();

	logSolution(part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.msToString(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.msToString(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
