import type { Article, Comment, Like, View } from "./types";

// Stable timestamps relative to "now" so the demo always looks fresh.
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const now = () => new Date();
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

export const mockArticles: Article[] = [
  {
    id: "art-001",
    title:
      "Alderman Reyes Pushes Affordable Housing Set-Aside for Pilsen Developments",
    source: "Chicago Defender",
    author: "Janelle Brooks",
    location: "Chicago, IL",
    category: "politics",
    image_url: null,
    created_at: ago(2 * DAY + 3 * HOUR),
    excerpt:
      "A new ordinance from Alderman Maritza Reyes would require any market-rate development of 20 units or more in the 25th Ward to set aside one-third of its homes for families earning under 60% of area median income.",
    body: `A new ordinance moving through City Council could reshape the way new housing gets built across Pilsen, Little Village and the western edge of the South Loop. Alderman Maritza Reyes (25th) introduced the proposal Tuesday night, joined by community organizers from the Pilsen Alliance and members of two parish councils.

"The market is not coming to save my neighbors," Reyes told a crowded chamber. "We are going to write the rule that the market has to follow."

Under the proposal, any market-rate development of 20 units or more in the 25th Ward would set aside one-third of its homes for families earning under 60% of area median income. That is a significantly higher set-aside than the citywide Affordable Requirements Ordinance, which currently caps mandated affordable units at 20 percent in most wards.

Developers pushed back almost immediately. The Home Builders Association of Greater Chicago called the threshold "economically unworkable" without additional tax incentives, and warned that projects would simply move to neighboring wards.

But longtime residents at the hearing said the displacement they have already lived through is the more pressing math problem. "I have watched four families on my block leave in two years," said Pilsen homeowner Esperanza Vela. "If we do not act now, there will be nobody left to argue about the rent."

The ordinance heads to the Housing Committee next month. Reyes says she has commitments from six colleagues, but will need at least three more to bring it to the floor.`,
  },
  {
    id: "art-002",
    title:
      "Pennsylvania Avenue Jazz Returns: Baltimore's Festival Roars Back After a Decade",
    source: "The Afro-American",
    author: "Marcus Whitfield",
    location: "Baltimore, MD",
    category: "culture",
    image_url: null,
    created_at: ago(1 * DAY + 6 * HOUR),
    excerpt:
      "After a ten-year hiatus, the Pennsylvania Avenue Jazz Festival returns this June with a three-block outdoor stage, an oral history tent, and headliners drawn from the city's own conservatories.",
    body: `For ten summers, the corner of Pennsylvania Avenue and Lafayette stayed quiet on the third weekend of June. This year, the horns come back.

Organizers from the Pennsylvania Avenue Black Arts and Entertainment District announced Wednesday that the Pennsylvania Avenue Jazz Festival will return June 19-21, 2026, after a decade of fundraising setbacks, pandemic delays, and what longtime trustee Della Greene called "the slow work of getting the neighborhood to believe in itself again."

The festival once drew Cab Calloway and Billie Holiday in its golden age. Greene says the new edition will not try to recreate that lineup, but it will honor it. A three-block outdoor stage will run from Dolphin to Laurens Street, with an oral history tent where residents can record their memories of the Royal Theater and the Avenue's club circuit.

Headliners are drawn largely from local conservatories: the Peabody Jazz Orchestra, vocalist Tyrese Hodge, and a reunion set from the Whitefield Brothers, who have not played the city together since 2014.

"This is not nostalgia, this is repair," said Mayor Brandon Scott at the announcement. The city is contributing $400,000 from its arts and culture fund, with a matching grant from the France-Merrick Foundation.

Residents on the surrounding blocks were cautious but warm. "Just keep the noise reasonable past ten," joked Marvin Joyner, who has lived on McCulloh Street for thirty-eight years. "And bring back the food trucks. Especially the crab pretzels."`,
  },
  {
    id: "art-003",
    title:
      "DC Charter Renewal Hearings Expose Deep Split Over Ward 7 Expansion",
    source: "The Washington Informer",
    author: "Kendra Boateng",
    location: "Washington, DC",
    category: "education",
    image_url: null,
    created_at: ago(4 * DAY + 1 * HOUR),
    excerpt:
      "A proposal to expand a high-performing charter network into two new Ward 7 buildings has divided parents, teachers' union leaders, and ANC commissioners over the future of neighborhood schools.",
    body: `A standing-room-only hearing at the DC Public Charter School Board ran past 11 p.m. on Monday as parents, teachers, and elected commissioners argued over a proposal to expand the Capital Compass Charter network into two new Ward 7 buildings.

Capital Compass currently operates four campuses in Wards 5, 7, and 8 and posts some of the highest math scores in the city. Its application would add a 6-12 building on Minnesota Avenue and a K-5 campus on Benning Road, drawing roughly 1,400 additional seats.

Supporters, many of them Compass parents, described the schools in personal terms. "My son was reading two grades below level. Now he is on the debate team," said Ward 7 mother Tasha Greene. "Do not take that option from another kid."

Opponents focused on what the expansion would mean for traditional DCPS schools nearby, where enrollment has fallen for four consecutive years. Washington Teachers' Union president Jacqueline Pogue Lyons told the board that two neighborhood middle schools could lose enough enrollment to trigger consolidation reviews. "We are not against choice," she said. "We are against starving the schools that take every child who walks through the door."

ANC 7B commissioner Andre Wallace urged the board to delay a vote until the city completes its long-promised facilities equity study. The board is expected to rule by mid-May.

Whatever the outcome, the hearing made clear that Ward 7 families do not feel they have been given a real plan for either system.`,
  },
  {
    id: "art-004",
    title:
      "Atlanta's Mobile Vaccine Van Logs 10,000th Visit on West Lake Route",
    source: "The Atlanta Voice",
    author: "Dr. Renee Holloway",
    location: "Atlanta, GA",
    category: "health",
    image_url: null,
    created_at: ago(5 * DAY + 9 * HOUR),
    excerpt:
      "Westside Community Clinic's mobile vaccination program reached a milestone Saturday in West Lake, where it has reduced the neighborhood's pediatric immunization gap by more than half since 2023.",
    body: `Westside Community Clinic's mobile vaccination program rolled into the West Lake MARTA parking lot Saturday morning and quietly logged its 10,000th patient visit since the van was donated by Grady Health in 2023.

The patient was 4-year-old Amari Fields, in for a booster shot. His mother Tia Fields said the van is the only reason her three children are caught up. "I work two jobs," she said. "When the clinic comes to my bus stop, I do not have to choose between the shot and the shift."

Westside's program targets the four ZIP codes in southwest Atlanta with the lowest pediatric immunization rates in Fulton County. Clinic director Dr. Aisha Walters said the gap between those neighborhoods and the county average has narrowed from 18 percentage points in 2023 to about 7 today.

The van is staffed by two rotating nurse practitioners, a community health worker, and a pharmacy student from Mercer. Vaccinations are free regardless of insurance status. "We do not check papers, we check arms," Walters said.

Funding remains tight. A federal Health Resources and Services Administration grant that covers about 40 percent of the program's annual budget is up for reauthorization this fall, and clinic officials said they are watching the appropriations debate in Washington with concern.

For now, the van keeps its weekly route: West Lake on Saturdays, Bankhead on Tuesdays, Pittsburgh on Thursdays, and a roving stop wherever a school nurse or church calls.`,
  },
  {
    id: "art-005",
    title:
      "Detroit Senior Centers Train Elders to Spot AI-Generated Misinformation",
    source: "The Michigan Chronicle",
    author: "Damon Pierce",
    location: "Detroit, MI",
    category: "tech",
    image_url: null,
    created_at: ago(6 * DAY + 14 * HOUR),
    excerpt:
      "A new digital literacy program at three Detroit senior centers is teaching residents over 60 how to identify AI-generated images, deepfake voicemails, and synthetic political ads ahead of the 2026 elections.",
    body: `The lights in the computer lab at the Northwest Activities Center dimmed Wednesday afternoon as instructor Camille Tate played two short audio clips for a room of fifteen seniors. One was a real radio ad. The other was a deepfake of the same voice asking listeners to "verify their voter registration" at a fake URL.

A handful of hands went up for the wrong clip. "And that is exactly why we are doing this," Tate said.

The class is part of a new digital literacy program from the Detroit Area Agency on Aging, in partnership with Wayne State's School of Information Sciences. It is running across three senior centers this spring, with plans to expand to all eight by fall.

Participants learn to look for telltale signs of AI-generated images, deepfake voicemails impersonating grandchildren, and synthetic political ads. The curriculum covers reverse image search, how to verify a caller through a callback number, and how to read a URL.

"I thought I was sharp," said 71-year-old participant Loretta Blair. "But that voicemail one had me. It sounded just like my nephew."

Organizers say they are racing the calendar. The 2026 election season is bringing a wave of synthetic political content, and seniors remain the demographic most likely to share misinformation, according to a 2023 NYU study.

Tate keeps the message simple. "Pause before you click. Pause before you forward. If your gut says something is off, your gut is probably right."`,
  },
];

// Build mock comments. Each article gets 8-15 comments, some with replies.
function makeComment(
  id: string,
  articleId: string,
  userName: string,
  body: string,
  hoursAgo: number,
  parentId: string | null = null
): Comment {
  return {
    id,
    article_id: articleId,
    user_id: `mock-user-${userName.replace(/\W/g, "").toLowerCase()}`,
    user_name: userName,
    user_avatar: null,
    body,
    parent_id: parentId,
    created_at: ago(hoursAgo * HOUR),
  };
}

export const mockComments: Comment[] = [
  // Article 1 — politics
  makeComment("c1-1", "art-001", "Marcus T.", "About time someone said it out loud. The current 20% set-aside has been a paper rule for years — developers find their way around it.", 36),
  makeComment("c1-2", "art-001", "Esperanza V.", "I was at the hearing. Nobody who lives here is asking for less than what Reyes proposed. We are tired.", 30),
  makeComment("c1-3", "art-001", "Dev_in_Chi", "33% is going to push capital across the river to Cicero. Then Pilsen gets nothing new at all. There has to be a tax abatement paired with this or it dies on paper.", 28, null),
  makeComment("c1-4", "art-001", "Marcus T.", "Or maybe the projects that pencil out at 33% are the only ones that should be built here. Not every deal deserves a ward.", 26, "c1-3"),
  makeComment("c1-5", "art-001", "Aisha W.", "Six colleagues is not nine. Who are the swing votes? That is the story.", 22),
  makeComment("c1-6", "art-001", "Father D.", "Glad to see the parish councils involved. They have been quietly housing displaced families for a decade with no help.", 20),
  makeComment("c1-7", "art-001", "Carla R.", "Define 60% AMI in real dollars please. Half the people quoting that number do not know what it means in this city.", 14),
  makeComment("c1-8", "art-001", "Dev_in_Chi", "60% AMI for a family of four in Chicago is roughly $63k. That is not poverty rent. That is a teacher.", 12, "c1-7"),
  makeComment("c1-9", "art-001", "Janet K.", "I will believe it when I see a unit get keys to a family. Until then this is another press release.", 6),
  makeComment("c1-10", "art-001", "Pilsen Renter", "Anybody know if existing buildings being sold count, or only new construction? The flips are the real problem on my block.", 3),

  // Article 2 — culture
  makeComment("c2-1", "art-002", "Della G.", "Trustee here. Thank you for the kind write-up. We have been working on this since 2017. Come out and bring your folding chair.", 28),
  makeComment("c2-2", "art-002", "Marvin J.", "Quoted in the Afro at age 73. Mama would be proud.", 26),
  makeComment("c2-3", "art-002", "Tyrese H.", "Honored to be on the bill. My grandfather played the Royal Theater in 1962. Full circle.", 24),
  makeComment("c2-4", "art-002", "Old Westsider", "I remember Pennsylvania Avenue when the marquee at the Royal was still lit up. If this brings half of that energy back, the city wins.", 22),
  makeComment("c2-5", "art-002", "Renee P.", "Oral history tent is the part nobody is talking about and it is the most important part. Please record everything.", 18),
  makeComment("c2-6", "art-002", "Skeptic in 21217", "Four hundred grand from the city is generous. Make sure the residents on McCulloh and Druid Hill see real benefit, not just festival weekend.", 14),
  makeComment("c2-7", "art-002", "Della G.", "Fair point. We have a year-round programming budget too — workshops at Eubie Blake, free youth horn lessons. Drop me a line if you want details.", 12, "c2-6"),
  makeComment("c2-8", "art-002", "Crab Pretzel Stan", "Marvin asked the only real question.", 10, "c2-2"),
  makeComment("c2-9", "art-002", "Aaliyah B.", "Peabody Jazz Orchestra is no joke. People do not realize how good those students are.", 4),

  // Article 3 — education
  makeComment("c3-1", "art-003", "Tasha G.", "I quoted in the article. I will say it again here: my son was failing. He is not anymore. That is the whole sentence.", 40),
  makeComment("c3-2", "art-003", "DCPS Teacher", "I do not doubt the success of individual kids at Compass. I doubt the city's ability to run two systems and not let one collapse.", 38),
  makeComment("c3-3", "art-003", "Andre W.", "ANC 7B here. Our request for delay is on the record. The facilities study has been promised since 2022.", 36),
  makeComment("c3-4", "art-003", "Ward 7 Dad", "We have been waiting on that study for so long my kid is now in middle school. Do not let the wait become the policy.", 34, "c3-3"),
  makeComment("c3-5", "art-003", "Jackie P.L.", "WTU is not anti-charter. We are anti-policy-by-attrition.", 30),
  makeComment("c3-6", "art-003", "Renee H.", "What is the demographic mix at Compass right now? Honest question. The expansion question depends on it.", 24),
  makeComment("c3-7", "art-003", "DCPS Teacher", "Their last-published numbers were ~70% Black, ~22% Latino, ~5% white, ~3% other. Roughly ward demographics, slightly less than the public schools next door.", 22, "c3-6"),
  makeComment("c3-8", "art-003", "Auntie B.", "Both/and, not either/or. Fund the neighborhood schools. Approve the charter. Stop pretending it has to be a war.", 18),
  makeComment("c3-9", "art-003", "Anonymous", "It does have to be a war when the funding pool is fixed. That is the structural piece nobody wants to say.", 14, "c3-8"),
  makeComment("c3-10", "art-003", "Tasha G.", "I just want my kid to read on grade level. Whatever building has the lights on, I will drive him there.", 8),
  makeComment("c3-11", "art-003", "Ward 5 Voter", "Watching this from outside Ward 7 — please get the facilities study done before another vote. The whole city is going to face this question.", 6),

  // Article 4 — health
  makeComment("c4-1", "art-004", "Tia F.", "Did not expect to see Amari quoted but here we are. The van is everything. Please do not let the funding lapse.", 60),
  makeComment("c4-2", "art-004", "Nurse on the van", "Saturday at West Lake is the best shift of my week. Y'all show up rain or shine.", 56),
  makeComment("c4-3", "art-004", "Westside Mom", "First time my kids have been fully caught up since 2019. The fact that I do not have to take a half day off is the whole game.", 50),
  makeComment("c4-4", "art-004", "Skeptic", "Why does Atlanta need a van for vaccines in 2026? What is the city actually doing with its public health budget?", 44),
  makeComment("c4-5", "art-004", "Dr. Walters", "Author of the program here, happy to answer this. The county budget covers fixed clinics. Mobile outreach has been zero-funded for years. The grant is what makes the van possible.", 42, "c4-4"),
  makeComment("c4-6", "art-004", "Skeptic", "Appreciate the response. Then the grant should not be the variable.", 40, "c4-5"),
  makeComment("c4-7", "art-004", "Pittsburgh Resident", "Thursdays in Pittsburgh, please keep coming. You parked at the church last week and the line was around the block — in a good way.", 30),
  makeComment("c4-8", "art-004", "Auntie M.", "The pharmacy student from Mercer treated my grandbaby like he was her own. Tell her thank you from row 4.", 18),
  makeComment("c4-9", "art-004", "Bankhead Dad", "Tuesday is the only day that works for me. So grateful.", 6),

  // Article 5 — tech
  makeComment("c5-1", "art-005", "Loretta B.", "Quoted in the article. I am the one who got the voicemail wrong. I'm not embarrassed — that is exactly why I'm taking the class.", 80),
  makeComment("c5-2", "art-005", "Camille T.", "Loretta is one of our best students because she's willing to be wrong out loud. That's how everyone learns.", 76, "c5-1"),
  makeComment("c5-3", "art-005", "Granddaughter", "Sent this to my whole family group chat. Grandma already forwarded it twice without reading it which is hilarious and also the problem.", 70),
  makeComment("c5-4", "art-005", "Wayne State Student", "Volunteered for two sessions. The questions these elders ask are sharper than what I get from undergrads. They are not behind, they are skeptical in the right way.", 60),
  makeComment("c5-5", "art-005", "Concerned Voter", "How can I get this class for my mother in Highland Park? She is not in the catchment area.", 48),
  makeComment("c5-6", "art-005", "Camille T.", "Email the Detroit Area Agency on Aging — we are trying to expand. We have curriculum we can share with any senior center that has a volunteer to run it.", 46, "c5-5"),
  makeComment("c5-7", "art-005", "Old School", "I do not own a smartphone and I will die on this hill. But I am still going to take the class. Knowing what to ignore is half the battle.", 36),
  makeComment("c5-8", "art-005", "Skeptic", "All due respect, the bigger problem is the platforms, not the seniors. We are training individuals to compensate for systemic harm.", 24),
  makeComment("c5-9", "art-005", "Camille T.", "Both true. We do this because the platforms are not going to fix themselves before November.", 22, "c5-8"),
  makeComment("c5-10", "art-005", "Loretta B.", "Pause before you click. Pause before you forward. I have it on a sticky note now.", 8),
];

// Mock likes — distribute across comments unevenly so some look popular.
export const mockLikes: Like[] = [];
const likeSeeds: Array<[string, number]> = [
  ["c1-1", 14], ["c1-2", 22], ["c1-3", 8], ["c1-5", 11], ["c1-6", 9],
  ["c1-9", 5], ["c1-10", 7],
  ["c2-1", 18], ["c2-2", 24], ["c2-3", 16], ["c2-5", 12], ["c2-9", 6],
  ["c3-1", 31], ["c3-2", 19], ["c3-5", 17], ["c3-8", 14], ["c3-10", 9],
  ["c3-11", 6],
  ["c4-1", 28], ["c4-2", 12], ["c4-3", 15], ["c4-5", 21], ["c4-7", 8],
  ["c4-8", 11],
  ["c5-1", 33], ["c5-2", 14], ["c5-3", 26], ["c5-4", 18], ["c5-7", 22],
  ["c5-9", 13], ["c5-10", 20],
];
for (const [commentId, count] of likeSeeds) {
  for (let i = 0; i < count; i++) {
    mockLikes.push({
      id: `like-${commentId}-${i}`,
      comment_id: commentId,
      user_id: `seed-user-${i}`,
      created_at: now().toISOString(),
    });
  }
}

// Mock views — give each article a different baseline.
export const mockViews: View[] = [];
const viewSeeds: Array<[string, number]> = [
  ["art-001", 1240],
  ["art-002", 980],
  ["art-003", 1610],
  ["art-004", 720],
  ["art-005", 540],
];
for (const [articleId, count] of viewSeeds) {
  for (let i = 0; i < count; i++) {
    mockViews.push({
      id: `view-${articleId}-${i}`,
      article_id: articleId,
      viewer_hash: `seed-hash-${i}`,
      created_at: now().toISOString(),
    });
  }
}
