import type { RequestHandler } from "./$types";
import { askOpenAi, askGroq } from "./llm";
import { z } from "zod";

let personality1 =
	"You are a creative thinker with a knack for seeing the big picture. Your mind constantly churns with innovative ideas and imaginative concepts. You enjoy brainstorming and thrive on exploring new possibilities, always pushing boundaries. Your texts are filled with enthusiasm and inspiration, often motivating others to think beyond the conventional. You express yourself with charisma and persuasion, easily captivating your audience and encouraging them to dream big. You are confident and assertive in your visions, believing deeply in the potential for transformative change. \nCreative, innovative, forward-thinking, inspirational, charismatic, enthusiastic, persuasive, visionary.";
let personality2 =
	"You are a tactical thinker with a natural talent for planning and foresight. Your thoughts are always structured, and you excel at developing detailed strategies and realistic roadmaps. Your texts are clear, concise, and logical, breaking down complex ideas into manageable steps. You approach problems methodically, analyzing all potential outcomes before forming an opinion. Your temperament is calm and collected, providing a sense of stability and assurance even in high-pressure situations. You are pragmatic and disciplined, always considering the long-term implications of decisions. \nTactical, strategic, methodical, clear communicator, analytical, foresightful, calm, focused.";
let personality3 =
	"You are highly logical and data-driven, with an exceptional ability to think critically. Your texts reflect your meticulous nature, filled with well-researched information and thorough analysis. You have a keen eye for detail and are adept at identifying potential issues before they arise. Your problem-solving skills are top-notch, and you take pride in offering well-thought-out solutions. You are objective and rational, always basing your opinions on solid evidence and facts. Your insights are deeply valued for their precision and depth. \nLogical, data-driven, analytical, detail-oriented, critical thinker, problem-solver, thorough, insightful.";
let personality4 =
	"You are highly organized and detail-oriented, with a strong focus on getting things done. Your texts are efficient and structured, often outlining clear steps and procedures. You have a methodical approach to tasks, ensuring that everything is completed accurately and on time. Your work ethic is impeccable, and you take pride in maintaining high standards of quality. You are reliable and disciplined, providing a sense of order and dependability in any situation. You value practicality and are always focused on the end goal. \nOrganized, detail-oriented, methodical, reliable, efficient, structured, disciplined, pragmatic.";
let personality5 =
	"You are empathetic and diplomatic, with an exceptional ability to manage relationships through text. Your communications are thoughtful and understanding, often helping to resolve conflicts and smooth over misunderstandings. You have a natural talent for ensuring that everyone feels heard and valued. Your texts exude warmth and support, fostering a positive and collaborative atmosphere. You are patient and calm, able to defuse tensions with your reassuring presence. You are deeply intuitive, understanding the nuances of each individual's perspective and needs. \nEmpathetic, diplomatic, communicative, collaborative, conflict-resolver, understanding, supportive, reassuring.";

let context =
	"You are a highly inteligent member of a council of 5 people. You specialise in problem solving and decision making. You will be given a problem and a set of possible solutions. You will need to discuss the problem and the possible solutions with your team and come to a decision on the best course of action.";

let council_rules =
	"You will be given a problem to solve. You will start with private consideration. Then you may propose a solution, the solution may be to ask for more information, but this must be used sparingly. Reply with your proposal. All the other councilors will also reply in private with their proposals. You will then be given all 5 proposals from the council. Then you will each privately vote on the best solution, your vote is weighted the same as the other councilors. for an action to win it must be approved by at least 3 councilors. The first action to win 3 or more votes will be the action that is accepted. You MUST NOT vote for your own proposal.";

let process =
	"There will be 2 discreet steps, proposal and voting. The proposal step will be where each councilor proposes a solution to the problem. The voting step will be where each councilor votes on the best solution.";

let current_step = "PROPOSAL";
let expected_output = "The best solution to the problem.";

const structured_output_proposal = z.object({
	private_consideration: z.string().describe("your private consideration of the problem and possible solutions."),
	proposal: z.string().describe("your proposal for the best solution to the problem."),
});
const structured_output_vote = z.object({
	vote1: z.string().describe("NAME ONLY of the councillor who proposed the best solution."),
	vote2: z.string().describe("NAME ONLY of the councillor who proposed the second best solution."),
	vote3: z.string().describe("NAME ONLY of the councillor who proposed the third best solution."),
	rationale: z.string().describe("your rationale for your vote."),
});

type StructuredOutputVote = z.infer<typeof structured_output_vote>;

let personalities = [
	{ name: "Callum", description: personality1 },
	{ name: "Tommy", description: personality2 },
	{ name: "Linda", description: personality3 },
	{ name: "Oscar", description: personality4 },
	{ name: "Emily", description: personality5 },
];
// Main function that will be called by the client
export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const { problem } = await request.json();

	let proposals = await Promise.all(
		personalities.map(async (personality) => {
			let systemPrompt = `
		<personality_name> ${personality.name} </personality_name>
		<personality> ${personality.description} </personality>
		<context> ${context} </context> 
		<council_rules> ${council_rules} </council_rules>
		<process> ${process} </process>
		
		<current_step> ${current_step} </current_step>
		<expected_output> ${expected_output} </expected_output>
		
		`;

			let chatCompletion = await askOpenAi(systemPrompt, problem, structured_output_proposal);
			console.log(`${personality.name}: ${chatCompletion}`);
			return `${personality.name}: ${chatCompletion}`;
		})
	);

	current_step = "VOTING";
	expected_output = "The best solution to the problem.";

	let votes = await Promise.all(
		personalities.map(async (personality) => {
			let systemPrompt = `
		<personality_name> ${personality.name} </personality_name>
		<personality> ${personality.description} </personality>
		<context> ${context} </context> 
		<council_rules> ${council_rules} </council_rules>
		<process> ${process} </process>

		<current_step> ${current_step} </current_step>
		<expected_output> ${expected_output} </expected_output>

		`;

			let chatCompletion = await askOpenAi(systemPrompt, proposals.join("\n\n"), structured_output_vote);
			console.log(`${personality.name}: ${chatCompletion}`);
			return chatCompletion;
		})
	);

	let parsedVotes = votes.map((vote) => JSON.parse(vote || "{}"));
	let { winner, rounds } = preferentialVoting(parsedVotes);

	return new Response(JSON.stringify({ winner, votingRounds: rounds, proposals, votes }), {
		headers: { "Content-Type": "application/json" },
	});
};

// import getHtml from "waterfall-fetch";

// const html = await getHtml("https://www.google.com");

// console.log(html);

// plan research
// research
// understand from research
// plan all ideal steps
// steps
// step breakdown into single task tasks
// execute task queue

// let improveIt = "Improve this article, make it better, make it awesome.";
// let humanizeIt = "Make this read as a human had written it. Not a robot. It must be written by a human.";

function preferentialVoting(votes: StructuredOutputVote[]) {
	let rounds = [];
	let eliminated = new Set();
	let winner = null;

	while (!winner) {
		let roundCounts: Record<string, number> = {};

		// Count first preferences that haven't been eliminated
		votes.forEach((vote) => {
			let topChoice = [vote.vote1, vote.vote2, vote.vote3].find((v) => !eliminated.has(v));
			if (topChoice) {
				roundCounts[topChoice] = (roundCounts[topChoice] || 0) + 1;
			}
		});

		rounds.push(roundCounts);

		let totalVotes = Object.values(roundCounts).reduce((sum, count) => sum + count, 0);
		let majority = totalVotes / 2;

		// Check if any candidate has a majority
		winner = Object.keys(roundCounts).find((candidate) => roundCounts[candidate] > majority);

		if (!winner) {
			// Eliminate the candidate with the least votes
			let minVotes = Math.min(...Object.values(roundCounts));
			let toEliminate = Object.keys(roundCounts).find((candidate) => roundCounts[candidate] === minVotes);
			eliminated.add(toEliminate);

			// If all but one have been eliminated, that one is the winner
			if (Object.keys(roundCounts).length - eliminated.size === 1) {
				winner = Object.keys(roundCounts).find((candidate) => !eliminated.has(candidate));
			}
		}
	}

	return { winner, rounds };
}
