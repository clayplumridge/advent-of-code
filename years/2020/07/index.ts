import _, { replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 7;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

interface WeightedGraphNode {
	key: string;
	edges: {
		weight: number;
		key: string;
	}[];
}

async function p2020day7_part1(input: string) {
	const lines = input.split("\n");
	const graphNodes = lines.map(ruleToNode);
	const graphNodeLookup = new Map<string, WeightedGraphNode>(graphNodes.map(x => [x.key, x]));
	return Array.from(graphNodeLookup.keys())
		.filter(x => x !== "shiny gold bag") // Gold bag has to go INSIDE another bag; don't count yourself
		.filter(x => search(graphNodeLookup, x, "shiny gold bag")).length;
}

function ruleToNode(rule: string): WeightedGraphNode {
	rule = replaceAll(rule, "bags", "bag");
	const [color, rest] = rule.split(" contain ");

	const children = replaceAll(rest, ".", "").split(", ");

	// Handle terminal nodes
	if (children[0].substr(0, 2) == "no") {
		return { key: color, edges: [] };
	}

	const edges: WeightedGraphNode["edges"] = children.map(child => {
		const words = child.split(" ");
		const weight = Number(words[0]);
		const key = words.slice(1).join(" ");
		return { key, weight };
	});

	return { key: color, edges };
}

const searchMemo: { [startToTarget: string]: boolean } = {};
function search(lookup: Map<string, WeightedGraphNode>, start: string, target: string): boolean {
	if (start == target) {
		return true;
	}
	const memoKey = `${start}-${target}`;

	if (searchMemo[memoKey] !== undefined) {
		return searchMemo[memoKey];
	}

	const node = lookup.get(start)!;
	const result = node.edges.filter(next => search(lookup, next.key, target)).length > 0;
	searchMemo[memoKey] = result;
	return result;
}

function replaceAll(str: string, search: string, replace: string) {
	return str.split(search).join(replace);
}

async function p2020day7_part2(input: string) {
	const lines = input.split("\n");
	const graphNodes = lines.map(ruleToNode);
	const graphNodeLookup = new Map<string, WeightedGraphNode>(graphNodes.map(x => [x.key, x]));
	return getTotalBags(graphNodeLookup, "shiny gold bag") - 1; // -1 for the root bag
}

function getTotalBags(lookup: Map<string, WeightedGraphNode>, start: string): number {
	const node = lookup.get(start)!;

	if (node.edges.length == 0) {
		return 1;
	}

	return lookup
		.get(start)!
		.edges.map(x => x.weight * getTotalBags(lookup, x.key))
		.reduce((prev, curr) => prev + curr, 1);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day7_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day7_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day7_part2(input));
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
